'use server';

import { suggestStoryStructure } from '@/ai/flows/suggest-story-structure';
import { generateStoryImage } from '@/ai/flows/generate-story-image';
import { z } from 'zod';
import { addStory, getNewStoryId } from './firestore';
import { revalidatePath } from 'next/cache';
import { storage } from './firebase';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

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
        // This block handles image generation and upload.
        // It's wrapped in a try/catch so that if it fails,
        // the story can still be saved without an image.
        const imagePrompt = `A child-friendly, vibrant illustration for a story titled "${title}" with the theme "${theme}". The story is about: ${content.substring(0, 500)}`;
        const imageResult = await generateStoryImage({ prompt: imagePrompt });

        if (imageResult?.imageUrl) {
            const imagePath = `stories/${storyId}.png`;
            const imageRef = ref(storage, imagePath);
            await uploadString(imageRef, imageResult.imageUrl, 'data_url');
            downloadURL = await getDownloadURL(imageRef);
        } else {
            console.warn("AI image generation failed or returned no image. Proceeding to save story without an image.");
        }
    } catch (e) {
        // If image generation or upload fails, we log the error and continue.
        // The user experience is that the story saves without a picture.
        console.error("An error occurred during image generation/upload, story will be saved without an image:", e);
    }

    try {
        // This block saves the story to Firestore.
        // This is the critical part. If this fails, the whole action fails.
        const excerpt = content.length > 100 ? content.substring(0, 100) + '...' : content;
        await addStory({
            id: storyId,
            title,
            content,
            theme,
            excerpt,
            imageUrl: downloadURL || '', // Default to empty string if undefined
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
        if (e.code === 'permission-denied' || (e.message && e.message.includes('permission-denied'))) {
            throw new Error("Permission denied. Could not save story to the database. Please check your Firestore security rules in the Firebase console.");
        }
        // This is the error that will be displayed in the toast on failure.
        throw new Error("Failed to save the story. Please try again.");
    }
}
