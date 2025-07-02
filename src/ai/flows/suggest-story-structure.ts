'use server';

/**
 * @fileOverview An AI agent that suggests a story structure with beginning, middle, and end hints.
 *
 * - suggestStoryStructure - A function that handles the story structure suggestion process.
 * - SuggestStoryStructureInput - The input type for the suggestStoryStructure function.
 * - SuggestStoryStructureOutput - The return type for the suggestStoryStructure function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestStoryStructureInputSchema = z.object({
  theme: z.string().describe('The theme of the story.'),
});
export type SuggestStoryStructureInput = z.infer<typeof SuggestStoryStructureInputSchema>;

const SuggestStoryStructureOutputSchema = z.object({
  beginning: z.string().describe('A hint for the beginning of the story.'),
  middle: z.string().describe('A hint for the middle of the story.'),
  end: z.string().describe('A hint for the end of the story.'),
});
export type SuggestStoryStructureOutput = z.infer<typeof SuggestStoryStructureOutputSchema>;

export async function suggestStoryStructure(input: SuggestStoryStructureInput): Promise<SuggestStoryStructureOutput> {
  return suggestStoryStructureFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestStoryStructurePrompt',
  input: {schema: SuggestStoryStructureInputSchema},
  output: {schema: SuggestStoryStructureOutputSchema},
  prompt: `You are a creative writing assistant for children. Given a story theme, suggest a story structure with hints for the beginning, middle, and end of the story.

Theme: {{{theme}}}

Structure your response as a JSON object.
`,
});

const suggestStoryStructureFlow = ai.defineFlow(
  {
    name: 'suggestStoryStructureFlow',
    inputSchema: SuggestStoryStructureInputSchema,
    outputSchema: SuggestStoryStructureOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
