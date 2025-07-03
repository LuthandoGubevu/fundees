import { Timestamp } from 'firebase/firestore';
import type { Story } from '@/lib/types';

/**
 * Extracts a Firestore index creation URL from an error message.
 * @param errorMessage The error message from Firestore.
 * @returns The extracted URL or null.
 */
export function extractIndexCreationLink(errorMessage: string): string | null {
    const regex = /(https:\/\/console\.firebase\.google\.com\S+)/;
    const match = errorMessage.match(regex);
    if (!match) return null;
    // The URL might have a trailing period, let's remove it.
    return match[0].replace(/\.$/, '');
}

/**
 * Transforms a Firestore document into a Story object, ensuring createdAt is a string.
 * @param doc The Firestore document.
 * @returns A Story object.
 */
export function transformStoryDoc(doc: any): Story {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Story;
}
