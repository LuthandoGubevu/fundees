'use server';

import { suggestStoryStructure } from '@/ai/flows/suggest-story-structure';
import { generateStoryImage } from '@/ai/flows/generate-story-image';
import { z } from 'zod';
import { addStory } from './mock-data';
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
});

export async function saveStoryAction(data: { title: string; content: string; theme: string}) {
    const validatedFields = saveStorySchema.safeParse(data);

    if (!validatedFields.success) {
        throw new Error("Invalid story data.");
    }
    
    const { title, content, theme } = validatedFields.data;

    try {
        const imageResult = await generateStoryImage({ storyTheme: `A child's drawing about ${theme}` });
        
        const excerpt = content.length > 100 ? content.substring(0, 100) + '...' : content;

        await addStory({
            title,
            content,
            theme,
            excerpt,
            imageUrl: imageResult.imageUrl,
            // Mock data for other fields
            author: 'A new author',
            grade: '2nd Grade',
            subject: 'Creativity',
            language: 'English',
            age: '7-8',
        });

        revalidatePath('/library');
        return { success: true };

    } catch (e) {
        console.error(e);
        throw new Error("Failed to save the story. The AI might be resting!");
    }
}
