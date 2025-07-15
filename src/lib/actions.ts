'use server';

import { suggestStoryStructure } from '@/ai/flows/suggest-story-structure';
import { generateStoryImage } from '@/ai/flows/generate-story-image';
import { z } from 'zod';
import { addStory, getNewStoryId } from './firestore';
import { revalidatePath } from 'next/cache';
import { storage } from './firebase/server'; // Use server storage

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
    let downloadURL: string | undefined;

    try {
        const imagePrompt = `A child-friendly, vibrant illustration for a story titled "${title}" with the theme "${theme}". The story is about: ${content.substring(0, 500)}`;
        const imageResult = await generateStoryImage({ prompt: imagePrompt });

        if (imageResult?.imageUrl) {
            const imagePath = `stories/${storyId}.png`;
            const file = storage.file(imagePath);
            const buffer = Buffer.from(imageResult.imageUrl.split(',')[1], 'base64');
            await file.save(buffer, {
                metadata: {
                    contentType: 'image/png'
                }
            });
            await file.makePublic();
            downloadURL = file.publicUrl();
        } else {
            console.warn("AI image generation failed or returned no image. Proceeding to save story without an image.");
        }
    } catch (e) {
        console.error("An error occurred during image generation/upload, story will be saved without an image:", e);
    }

    try {
        const excerpt = content.length > 100 ? content.substring(0, 100) + '...' : content;
        await addStory({
            id: storyId,
            title,
            content,
            theme,
            excerpt,
            imageUrl: downloadURL || '',
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
