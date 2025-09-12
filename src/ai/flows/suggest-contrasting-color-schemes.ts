'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting contrasting color schemes.
 *
 * It generates 5 different color combination schemes to ensure high readability and visual appeal.
 * - suggestContrastingColorSchemes - A function that suggests contrasting color schemes.
 * - SuggestContrastingColorSchemesInput - The input type for the suggestContrastingColorSchemes function.
 * - SuggestContrastingColorSchemesOutput - The return type for the suggestContrastingColorSchemes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContrastingColorSchemesInputSchema = z.object({
  baseBackgroundColor: z
    .string()
    .describe('The base background color in hex format (e.g., #FFFFFF).'),
});
export type SuggestContrastingColorSchemesInput = z.infer<
  typeof SuggestContrastingColorSchemesInputSchema
>;

const SuggestContrastingColorSchemesOutputSchema = z.object({
  colorSchemes: z
    .array(
      z.object({
        backgroundColor: z
          .string()
          .describe('The suggested background color in hex format.'),
        textColor: z
          .string()
          .describe('The suggested text color in hex format.'),
      })
    )
    .describe('An array of 5 suggested color schemes.'),
});
export type SuggestContrastingColorSchemesOutput = z.infer<
  typeof SuggestContrastingColorSchemesOutputSchema
>;

export async function suggestContrastingColorSchemes(
  input: SuggestContrastingColorSchemesInput
): Promise<SuggestContrastingColorSchemesOutput> {
  return suggestContrastingColorSchemesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContrastingColorSchemesPrompt',
  input: {schema: SuggestContrastingColorSchemesInputSchema},
  output: {schema: SuggestContrastingColorSchemesOutputSchema},
  prompt: `You are a color palette expert. Given a base background color, suggest 5 different color schemes that provide good contrast and readability. Each color scheme should consist of a background color and a text color.

Base Background Color: {{{baseBackgroundColor}}}

Return the color schemes in JSON format:

{
  "colorSchemes": [
    {
      "backgroundColor": "<hex code>",
      "textColor": "<hex code>"
    },
    {
      "backgroundColor": "<hex code>",
      "textColor": "<hex code>"
    },
    {
      "backgroundColor": "<hex code>",
      "textColor": "<hex code>"
    },
    {
      "backgroundColor": "<hex code>",
      "textColor": "<hex code>"
    },
    {
      "backgroundColor": "<hex code>",
      "textColor": "<hex code>"
    }
  ]
}`,
});

const suggestContrastingColorSchemesFlow = ai.defineFlow(
  {
    name: 'suggestContrastingColorSchemesFlow',
    inputSchema: SuggestContrastingColorSchemesInputSchema,
    outputSchema: SuggestContrastingColorSchemesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
