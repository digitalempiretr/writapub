/**
 * @fileoverview A flow that finds images based on a search query using the Pexels API.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { createClient, type Photos } from 'pexels';

const FindImagesInputSchema = z.object({
  query: z.string().describe('The search query for images.'),
  per_page: z.number().optional().default(6),
  page: z.number().optional().default(1),
});
export type FindImagesInput = z.infer<typeof FindImagesInputSchema>;

const FindImagesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('A list of image URLs from Pexels.'),
});
export type FindImagesOutput = z.infer<typeof FindImagesOutputSchema>;


async function searchPexelsImages(
  query: string,
  apiKey: string,
  per_page: number,
  page: number
): Promise<string[]> {
  try {
    const client = createClient(apiKey);
    const response = await client.photos.search({ query, per_page, page });

    if ('photos' in response) {
      return response.photos.map((photo) => photo.src.large);
    }
    return [];
  } catch (error) {
    console.error('Error searching for images on Pexels:', error);
    throw new Error('Failed to search for images on Pexels.');
  }
}

export const findImagesFlow = ai.defineFlow(
  {
    name: 'findImagesFlow',
    inputSchema: FindImagesInputSchema,
    outputSchema: FindImagesOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      throw new Error(
        'Your Pexels API Key is not configured. Please check the `.env` file in the root directory of your project and add the `PEXELS_API_KEY`.'
      );
    }

    const imageUrls = await searchPexelsImages(input.query, apiKey, input.per_page!, input.page!);

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
