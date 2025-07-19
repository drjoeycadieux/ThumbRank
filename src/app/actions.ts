
'use server';

import { rankThumbnails, type RankThumbnailsOutput } from '@/ai/flows/rank-thumbnails';

export async function rankThumbnailsAction(
  thumbnailDataUris: string[]
): Promise<RankThumbnailsOutput> {
  if (!thumbnailDataUris || thumbnailDataUris.length === 0) {
    throw new Error('No thumbnails provided.');
  }
  
  try {
    const result = await rankThumbnails({ thumbnailDataUris });
    return result;
  } catch (error) {
    console.error("Error in rankThumbnailsAction:", error);
    // Provide a more user-friendly error message
    throw new Error("The AI failed to process the thumbnails. Please try again with different images.");
  }
}
