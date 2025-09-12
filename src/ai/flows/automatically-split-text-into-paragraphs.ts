'use server';
/**
 * @fileOverview Automatically splits input text into logical paragraphs of 300-350 characters,
 * using the first sentence of the first paragraph as a title if no title is provided.
 *
 * - automaticallySplitTextIntoParagraphs - A function that handles the text splitting process.
 * - AutomaticallySplitTextIntoParagraphsInput - The input type for the automaticallySplitTextIntoParagraphs function.
 * - AutomaticallySplitTextIntoParagraphsOutput - The return type for the automaticallySplitTextIntoParagraphs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticallySplitTextIntoParagraphsInputSchema = z.object({
  text: z.string().describe('The text to split into paragraphs.'),
  title: z.string().optional().describe('Optional title for the text.'),
});
export type AutomaticallySplitTextIntoParagraphsInput = z.infer<
  typeof AutomaticallySplitTextIntoParagraphsInputSchema
>;

const AutomaticallySplitTextIntoParagraphsOutputSchema = z.object({
  title: z.string().describe('The title of the text.'),
  paragraphs: z.array(z.string()).describe('The text split into paragraphs.'),
});
export type AutomaticallySplitTextIntoParagraphsOutput = z.infer<
  typeof AutomaticallySplitTextIntoParagraphsOutputSchema
>;

export async function automaticallySplitTextIntoParagraphs(
  input: AutomaticallySplitTextIntoParagraphsInput
): Promise<AutomaticallySplitTextIntoParagraphsOutput> {
  return automaticallySplitTextIntoParagraphsFlow(input);
}

const automaticallySplitTextIntoParagraphsPrompt = ai.definePrompt({
  name: 'automaticallySplitTextIntoParagraphsPrompt',
  input: {schema: AutomaticallySplitTextIntoParagraphsInputSchema},
  output: {schema: AutomaticallySplitTextIntoParagraphsOutputSchema},
  prompt: `You are a text processing expert. You will split the given text into paragraphs. Each paragraph MUST have between 300 and 350 characters.
If the user provided a title, use it as the title, otherwise use the first sentence of the first paragraph as the title.

Text: {{{text}}}
Title: {{{title}}}

Output the title and the paragraphs.
`,
});

const automaticallySplitTextIntoParagraphsFlow = ai.defineFlow(
  {
    name: 'automaticallySplitTextIntoParagraphsFlow',
    inputSchema: AutomaticallySplitTextIntoParagraphsInputSchema,
    outputSchema: AutomaticallySplitTextIntoParagraphsOutputSchema,
  },
  async input => {
    const {output} = await automaticallySplitTextIntoParagraphsPrompt(input);
    return output!;
  }
);
