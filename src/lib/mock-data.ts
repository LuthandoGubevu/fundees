/**
 * This file is deprecated. Data is now fetched from and saved to Firebase Firestore.
 * See src/lib/firestore.ts for the new data-handling functions.
 * The data below is kept for reference or for potential seeding scripts.
 */
import type { Story, User } from './types';

// In a real app, you'd use a database.
export const users: User[] = [
    {
        id: '1',
        firstName: 'Amina',
        lastName: 'Chike',
        email: 'amina@school.com',
        school: 'Sunshine Primary',
        grade: '3rd Grade',
        password: 'password123',
        totalLikes: 42,
    },
    {
        id: '2',
        firstName: 'Luthando',
        lastName: 'Cele',
        email: 'luthando@school.com',
        school: 'Future Stars Academy',
        grade: '5th Grade',
        password: 'password123',
        totalLikes: 15,
    }
  ];

export const stories: Story[] = [
  {
    id: '1',
    title: 'The First Fundee',
    author: 'The Fundees Team',
    authorId: '0',
    grade: '2nd Grade',
    subject: 'Creativity',
    language: 'English',
    excerpt: "The story of Fundees itself! A magical place where a little sunbeam's idea for a story turned into a grand adventure with a beautiful, AI-generated picture...",
    content: "In a world shimmering with imagination, a new friend was born: Fundee! Fundee wasn't a person, but a magical place on a screen where stories could come to life. Its first-ever story was about a brave little sunbeam who wanted to paint the whole world with happy colors. With a little help from a friendly AI, the sunbeam's story got a beautiful picture, showing everyone that even the smallest idea can become a grand adventure.",
    likes: 30,
    age: '7-8',
    theme: 'Creativity',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: '2',
    title: 'Anansi the Spider',
    author: 'Amina Chike',
    authorId: '1',
    school: 'Sunshine Primary',
    grade: '3rd Grade',
    subject: 'Folklore',
    language: 'English',
    excerpt: 'A classic West African tale about the clever spider Anansi, who tries to hoard all the wisdom in the world...',
    content: 'Anansi the spider was very clever, but he was also very greedy. He decided he wanted to have all the wisdom in the world for himself. He went around and collected all the wisdom he could find and put it in a big pot. He decided to hide the pot on top of a very tall tree. As he was climbing, his son saw him and asked what he was doing. Anansi was so annoyed that he let go of the pot, it smashed, and all the wisdom flew out to all the corners of the world. And that is why no one person has all the wisdom.',
    likes: 42,
    age: '8-9',
    theme: 'Folklore',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: '3',
    title: 'The Talking Baobab Tree',
    author: 'Luthando Cele',
    authorId: '2',
    school: 'Future Stars Academy',
    grade: '5th Grade',
    subject: 'Nature',
    language: 'English',
    excerpt: 'Luthando discovers an ancient baobab tree in the village that can speak, and it shares the secret of the changing seasons...',
    content: 'In the heart of the village stood a giant baobab tree, its branches reaching for the sky like wise old arms. One sunny afternoon, while chasing a colourful butterfly, Luthando stumbled upon the tree. To his amazement, the tree whispered his name! The baobab shared ancient secrets about why the rains come and go, and how the stars are the campfires of the ancestors. Luthando promised to keep the tree\'s secret, becoming the guardian of its stories.',
    likes: 15,
    age: '9-10',
    theme: 'Nature',
    imageUrl: 'https://placehold.co/600x400.png',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  }
];

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    throw new Error("Deprecated: Use functions from /lib/firestore.ts instead.");
};

export const addUser = async (user: Omit<User, 'id'>): Promise<User> => {
    throw new Error("Deprecated: Use functions from /lib/firestore.ts instead.");
};

export const getStories = async (): Promise<Story[]> => {
  throw new Error("Deprecated: Use functions from /lib/firestore.ts instead.");
};

export const getStoryById = async (id: string): Promise<Story | undefined> => {
    throw new Error("Deprecated: Use functions from /lib/firestore.ts instead.");
};

export const addStory = async (story: Omit<Story, 'id' | 'createdAt' | 'likes'>): Promise<Story> => {
  throw new Error("Deprecated: Use functions from /lib/firestore.ts instead.");
};
