// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Generates an image for a story.
 *
 * - generateStoryImage - A function that generates an image for a story.
 * - GenerateStoryImageInput - The input type for the generateStoryImage function.
 * - GenerateStoryImageOutput - The return type for the generateStoryImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryImageInputSchema = z.object({
  prompt: z.string().describe('The prompt for the image generation, based on the story content.'),
});
export type GenerateStoryImageInput = z.infer<typeof GenerateStoryImageInputSchema>;

const GenerateStoryImageOutputSchema = z.object({
  imageUrl: z.string().describe('The data URI of the generated image.'),
});
export type GenerateStoryImageOutput = z.infer<typeof GenerateStoryImageOutputSchema>;

export async function generateStoryImage(input: GenerateStoryImageInput): Promise<GenerateStoryImageOutput> {
  return generateStoryImageFlow(input);
}

const generateStoryImageFlow = ai.defineFlow(
  {
    name: 'generateStoryImageFlow',
    inputSchema: GenerateStoryImageInputSchema,
    outputSchema: GenerateStoryImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `A child's drawing illustrating the following story: ${input.prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    return {
      imageUrl: media!.url,
    };
  }
);
