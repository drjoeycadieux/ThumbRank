// This file is machine-generated - edit at your own risk!

'use server';

/**
 * @fileOverview Ranks YouTube thumbnails based on predicted click-through rate.
 *
 * - rankThumbnails - A function that ranks the thumbnails.
 * - RankThumbnailsInput - The input type for the rankThumbnails function.
 * - RankThumbnailsOutput - The return type for the rankThumbnails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RankThumbnailsInputSchema = z.object({
  thumbnailDataUris: z
    .array(z.string())
    .describe(
      'An array of YouTube thumbnails, as data URIs that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});

export type RankThumbnailsInput = z.infer<typeof RankThumbnailsInputSchema>;

const RankedThumbnailSchema = z.object({
  dataUri: z.string().describe('The thumbnail image data URI.'),
  predictedCtr: z.number().describe('The predicted click-through rate for the thumbnail.'),
  explanation: z.string().describe('The AI explanation for the predicted CTR.'),
});

const RankThumbnailsOutputSchema = z.object({
  rankedThumbnails: z.array(RankedThumbnailSchema).describe('The thumbnails ranked by predicted click-through rate.'),
});

export type RankThumbnailsOutput = z.infer<typeof RankThumbnailsOutputSchema>;

export async function rankThumbnails(input: RankThumbnailsInput): Promise<RankThumbnailsOutput> {
  return rankThumbnailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankThumbnailsPrompt',
  input: {schema: RankThumbnailsInputSchema},
  output: {schema: RankThumbnailsOutputSchema},
  prompt: `You are an expert in YouTube thumbnail design and click-through rate (CTR) optimization.

You are provided with multiple thumbnails for a YouTube video. Analyze each thumbnail and rank them based on your prediction of their click-through rate (CTR). Provide a brief explanation for each thumbnail's ranking.

Output the thumbnails in a JSON format, ranked from highest to lowest predicted CTR.

Thumbnails:
{{#each thumbnailDataUris}}
  {{@index}}: {{media url=this}}
{{/each}}`,
});

const rankThumbnailsFlow = ai.defineFlow(
  {
    name: 'rankThumbnailsFlow',
    inputSchema: RankThumbnailsInputSchema,
    outputSchema: RankThumbnailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
