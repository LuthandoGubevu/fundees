'use server';

import { db } from '@/lib/firebase';
import type { Story, User } from '@/lib/types';
import { stories as mockStories, users as mockUsers } from '@/lib/mock-data';
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  doc,
  runTransaction,
  serverTimestamp,
  orderBy,
  limit,
  increment,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

function transformStoryDoc(doc: any) {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Story;
}

function extractIndexCreationLink(errorMessage: string): string | null {
    const regex = /(https:\/\/console\.firebase\.google\.com\S+)/;
    const match = errorMessage.match(regex);
    if (!match) return null;
    // The URL might have a trailing period, let's remove it.
    return match[0].replace(/\.$/, '');
}


// --- User Functions ---
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    const userDoc = querySnapshot.docs[0];
    // NOTE: This includes the mock password. Be careful in a real app.
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn('Firestore permission denied. Falling back to mock data for user email:', email);
      const mockUser = mockUsers.find(u => u.email === email);
      return mockUser || null;
    }
    throw error;
  }
}

export async function addUser(userData: Omit<User, 'id'>): Promise<User> {
    const { password } = userData;
    const userToSave = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        school: userData.school,
        grade: userData.grade,
        totalLikes: 0,
        createdAt: serverTimestamp(),
        // In a real app, you'd hash the password or use Firebase Auth.
        // For this prototype, we'll store it directly to simulate login.
        password: password, 
    };

    const userRef = await addDoc(collection(db, 'users'), userToSave);
    return { id: userRef.id, ...userData, totalLikes: 0 };
}


// --- Story Functions ---
export async function getStories(): Promise<Story[]> {
  try {
    const storiesCol = collection(db, 'stories');
    const q = query(storiesCol, orderBy('createdAt', 'desc'));
    const storySnapshot = await getDocs(q);
    return storySnapshot.docs.map(transformStoryDoc);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn('Firestore permission denied. Falling back to mock data. Please enable the Firestore API in your Google Cloud project.');
      return mockStories;
    }
    throw error;
  }
}

export async function getStoriesByAuthor(authorId: string): Promise<Story[]> {
    try {
        const storiesCol = collection(db, 'stories');
        const q = query(storiesCol, where('authorId', '==', authorId), orderBy('createdAt', 'desc'));
        const storySnapshot = await getDocs(q);
        return storySnapshot.docs.map(transformStoryDoc);
    } catch (error: any) {
        if (
            error.code === 'failed-precondition' &&
            error.message &&
            error.message.includes('requires an index')
        ) {
            const link = extractIndexCreationLink(error.message);
            if (link) {
                throw new Error(`MISSING_INDEX::${link}`);
            }
        }
        if (error.code === 'permission-denied') {
            console.warn('Firestore permission denied. Falling back to mock data for author ID:', authorId);
            return mockStories.filter(s => s.authorId === authorId);
        }
        throw error;
    }
}

export async function getStoryById(id: string): Promise<Story | null> {
  try {
    const storyDocRef = doc(db, 'stories', id);
    const storyDoc = await getDoc(storyDocRef);
    if (!storyDoc.exists()) {
      return null;
    }
    return transformStoryDoc(storyDoc);
  } catch (error: any) {
    if (error.code === 'permission-denied') {
        console.warn('Firestore permission denied. Falling back to mock data for story ID:', id);
        const mockStory = mockStories.find(s => s.id === id);
        return mockStory || null;
    }
    throw error;
  }
}

export async function getNewStoryId(): Promise<string> {
  const storyRef = doc(collection(db, 'stories'));
  return storyRef.id;
}

export async function addStory(story: Omit<Story, 'createdAt'>): Promise<Story> {
  const { id, ...storyData } = story;
  const storyRef = doc(db, 'stories', id);

  await setDoc(storyRef, {
    ...storyData,
    createdAt: serverTimestamp(),
  });
  
  const newStoryDoc = await getDoc(storyRef);
  return transformStoryDoc(newStoryDoc);
}

// --- Like Functionality ---
export async function toggleLikeStory(storyId: string, authorId: string, likerId: string) {
    if (!likerId) {
        throw new Error('You must be logged in to like a story.');
    }

    const storyRef = doc(db, 'stories', storyId);
    const likeRef = doc(db, 'stories', storyId, 'likes', likerId);
    // User might not exist in a test environment
    const authorRef = authorId ? doc(db, 'users', authorId) : null;

    try {
        await runTransaction(db, async (transaction) => {
            const likeDoc = await transaction.get(likeRef);
            
            if (likeDoc.exists()) {
                // User has already liked, so unlike
                transaction.delete(likeRef);
                transaction.update(storyRef, { likes: increment(-1) });
                if (authorRef) {
                  transaction.update(authorRef, { totalLikes: increment(-1) });
                }
            } else {
                // User has not liked, so like
                transaction.set(likeRef, { createdAt: serverTimestamp(), userId: likerId });
                transaction.update(storyRef, { likes: increment(1) });
                if (authorRef) {
                  transaction.update(authorRef, { totalLikes: increment(1) });
                }
            }
        });

    } catch (error: any) {
        console.error("Transaction failed: ", error);
        if (error.code === 'permission-denied') {
            throw new Error("Could not like story. Please make sure the Firestore API is enabled in your Google Cloud project.");
        }
        throw new Error("Could not update like status.");
    }
}