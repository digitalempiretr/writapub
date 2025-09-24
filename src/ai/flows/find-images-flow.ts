/**
 * @fileoverview A flow that finds images based on a search query using the Pexels API.
 */
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { createClient, type Photos } from 'pexels';

const FindImagesInputSchema = z.object({
  query: z.string().describe('The search query for images.'),
});
export type FindImagesInput = z.infer<typeof FindImagesInputSchema>;

const FindImagesOutputSchema = z.object({
  imageUrls: z.array(z.string()).describe('A list of image URLs from Pexels.'),
});
export type FindImagesOutput = z.infer<typeof FindImagesOutputSchema>;


async function searchPexelsImages(
  query: string,
  apiKey: string,
): Promise<string[]> {
  try {
    const client = createClient(apiKey);
    const response = await client.photos.search({ query, per_page: 10 });

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
        'Pexels API Anahtarınız yapılandırılmamış. Lütfen projenizin ana dizinindeki `.env` dosyasını kontrol edin ve `PEXELS_API_KEY` anahtarını ekleyin.'
      );
    }

    const imageUrls = await searchPexelsImages(input.query, apiKey);

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
