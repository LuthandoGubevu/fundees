'use server';

import { suggestStoryStructure } from '@/ai/flows/suggest-story-structure';
import { z } from 'zod';
import { addStory, getNewStoryId } from './firestore';
import { revalidatePath } from 'next/cache';

const structureSchema = z.object({
  theme: z.string().min(3, 'Theme must be at least 3 characters'),
});
export async function getStoryStructure(prevState: any, formData: FormData) {
  const validatedFields = structureSchema.safeParse({
    theme: formData.get('theme'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const structure = await suggestStoryStructure({ theme: validatedFields.data.theme });
    return { data: structure };
  } catch (e) {
    return { error: 'Failed to generate story structure. Please try again.' };
  }
}

const saveStorySchema = z.object({
    title: z.string().min(3, "Please enter a title."),
    content: z.string().min(10, "Your story is too short!"),
    theme: z.string(),
    author: z.object({
        id: z.string(),
        name: z.string(),
        school: z.string(),
        grade: z.string(),
    })
});

export async function saveStoryAction(data: z.infer<typeof saveStorySchema>) {
    const validatedFields = saveStorySchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid story data.");
    }
    
    const { title, content, theme, author } = validatedFields.data;
    const storyId = await getNewStoryId();

    try {
        const excerpt = content.length > 100 ? content.substring(0, 100) + '...' : content;
        await addStory({
            id: storyId,
            title,
            content,
            theme,
            excerpt,
            author: author.name,
            authorId: author.id,
            school: author.school,
            grade: author.grade,
            subject: 'Creativity',
            language: 'English',
            age: '7-8',
            likes: 0,
        });

        revalidatePath('/library');
        revalidatePath('/dashboard');
        return { success: true };

    } catch (e: any) {
        console.error("Failed to save story to Firestore:", e);
        if (e.message?.includes('permission-denied') || e.message?.includes('Missing or insufficient permissions')) {
            throw new Error("Permission denied. Could not save story to the database. Please check your Firestore security rules in the Firebase console.");
        }
        throw new Error("Failed to save the story. Please try again.");
    }
}
