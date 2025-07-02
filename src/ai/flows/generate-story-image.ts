// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates a placeholder image reflecting an African context for a story.
 *
 * - generateStoryImage - A function that generates an image for a story.
 * - GenerateStoryImageInput - The input type for the generateStoryImage function.
 * - GenerateStoryImageOutput - The return type for the generateStoryImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryImageInputSchema = z.object({
  storyTheme: z.string().describe('The theme of the story to generate an image for. This should be an African theme.'),
});
export type GenerateStoryImageInput = z.infer<typeof GenerateStoryImageInputSchema>;

const GenerateStoryImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateStoryImageOutput = z.infer<typeof GenerateStoryImageOutputSchema>;

export async function generateStoryImage(input: GenerateStoryImageInput): Promise<GenerateStoryImageOutput> {
  return generateStoryImageFlow(input);
}

const generateStoryImagePrompt = ai.definePrompt({
  name: 'generateStoryImagePrompt',
  input: {schema: GenerateStoryImageInputSchema},
  output: {schema: GenerateStoryImageOutputSchema},
  prompt: `Generate a visually stunning and culturally relevant image that captures the essence of an African story theme: {{{storyTheme}}}. The image should be suitable as a placeholder for a story and reflect the rich cultural heritage of Africa.`,
});

const generateStoryImageFlow = ai.defineFlow(
  {
    name: 'generateStoryImageFlow',
    inputSchema: GenerateStoryImageInputSchema,
    outputSchema: GenerateStoryImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: input.storyTheme,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      imageUrl: media!.url,
    };
  }
);
