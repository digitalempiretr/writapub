'use server';
/**
 * @fileOverview This flow processes text to extract a title and prepares the body content.
 * It identifies the first sentence as the title if no title is provided,
 * and then returns the title and the rest of the text as a single block.
 *
 * - automaticallySplitTextIntoParagraphs - A function that handles the text processing.
 * - AutomaticallySplitTextIntoParagraphsInput - The input type for the function.
 * - AutomaticallySplitTextIntoParagraphsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomaticallySplitTextIntoParagraphsInputSchema = z.object({
  text: z.string().describe('The text to process.'),
  title: z.string().optional().describe('Optional title for the text.'),
});
export type AutomaticallySplitTextIntoParagraphsInput = z.infer<
  typeof AutomaticallySplitTextIntoParagraphsInputSchema
>;

const AutomaticallySplitTextIntoParagraphsOutputSchema = z.object({
  title: z.string().describe('The title of the text.'),
  paragraphs: z.array(z.string()).describe('The processed body of the text as a single element array.'),
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
  prompt: `You are a text processing assistant. Your task is to process the given text according to the following rules:

1.  If the user provides a title, use it as the title. The "text" input should be returned as a single block in the "paragraphs" array.
2.  If no title is provided, you MUST use the first sentence of the original text as the title.
3.  If you use the first sentence as the title, you MUST remove that sentence from the beginning of the text body.
4.  The remaining text body MUST be returned as a single string inside the "paragraphs" array. Do not split it.

Original Text:
{{{text}}}

Title (if provided):
{{{title}}}

Provide the output with the extracted title and the single, consolidated text block.
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
