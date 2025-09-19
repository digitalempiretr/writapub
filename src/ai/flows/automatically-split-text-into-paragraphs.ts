'use server';
/**
 * @fileOverview Automatically splits input text into logical paragraphs of 300-350 characters,
 * with a maximum of 12 lines, using the first sentence of the first paragraph as a title if no title is provided.
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
  prompt: `You are a text processing expert. Your task is to split the given text into multiple paragraphs.

Here are the rules you MUST follow in order:
1.  The absolute most important rule is that each paragraph MUST NOT exceed 12 lines. This is a strict, non-negotiable limit.
2.  While adhering to the 12-line limit, try to make each paragraph between 300 and 350 characters long. The line limit takes priority over character count.
3.  The paragraphs should be logically separated and make sense.
4.  If the user provides a title, use it.
5.  If no title is provided, you MUST use the first sentence of the original text as the title.
6.  If you use the first sentence as the title, you MUST remove that sentence from the beginning of the text body that you will split into paragraphs. Do not repeat the title in the first paragraph.

Original Text:
{{{text}}}

Title (if provided):
{{{title}}}

Based on these strict rules, provide the output with the title and the array of paragraphs.
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
