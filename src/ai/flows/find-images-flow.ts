/**
 * @fileoverview A flow that finds images based on a search query.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { google } from 'googleapis';

const customsearch = google.customsearch('v1');

const FindImagesInputSchema = z.object({
  query: z.string().describe('The search query for images.'),
});
export type FindImagesInput = z.infer<typeof FindImagesInputSchema>;

const FindImagesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('A list of image URLs.'),
});
export type FindImagesOutput = z.infer<typeof FindImagesOutputSchema>;

async function searchImages(
  query: string,
  apiKey: string,
  cx: string
): Promise<string[]> {
  try {
    const response = await customsearch.cse.list({
      q: query,
      auth: apiKey,
      cx: cx,
      searchType: 'image',
      num: 10,
      imgSize: 'huge',
      safe: 'high',
    });

    const items = response.data.items;
    if (!items) {
      return [];
    }

    return items.map((item) => item.link).filter((link): link is string => !!link);
  } catch (error) {
    console.error('Error searching for images:', error);
    throw new Error('Failed to search for images.');
  }
}

export const findImagesFlow = ai.defineFlow(
  {
    name: 'findImagesFlow',
    inputSchema: FindImagesInputSchema,
    outputSchema: FindImagesOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cx = process.env.GOOGLE_CUSTOM_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
      throw new Error(
        'Google API Key or Custom Search Engine ID is not configured. Please create them in Google Cloud Console and add them to your .env file.'
      );
    }

    const imageUrls = await searchImages(input.query, apiKey, cx);

    return {
      imageUrls,
    };
  }
);

export async function findImages(
  input: FindImagesInput
): Promise<FindImagesOutput> {
  return findImagesFlow(input);
}
