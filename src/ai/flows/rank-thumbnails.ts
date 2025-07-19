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
  predictedCtr: z
    .number()
    .describe('The predicted click-through rate (CTR) for the thumbnail, from 0 to 1.'),
  explanation: z
    .string()
    .describe('The AI explanation for the predicted CTR and ranking.'),
});

const RankThumbnailsOutputSchema = z.object({
  rankedThumbnails: z
    .array(RankedThumbnailSchema)
    .describe(
      'The thumbnails ranked by predicted click-through rate, from best to worst.'
    ),
});

export type RankThumbnailsOutput = z.infer<typeof RankThumbnailsOutputSchema>;

export async function rankThumbnails(
  input: RankThumbnailsInput
): Promise<RankThumbnailsOutput> {
  return rankThumbnailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'rankThumbnailsPrompt',
  input: {schema: RankThumbnailsInputSchema},
  output: {schema: RankThumbnailsOutputSchema},
  prompt: `You are an expert YouTube growth hacker specializing in viral content and click-through rate (CTR) optimization.

You have been given a set of YouTube thumbnails for the same video. Your task is to analyze each thumbnail and rank them from best to worst based on their predicted click-through rate.

For each thumbnail, you must:
1.  Provide a predicted CTR as a score from 0.0 to 1.0.
2.  Provide a concise, expert explanation for why you've given it that score. Be specific. Mention visual elements, emotional triggers, clarity, and overall design.
3.  The final output must be a JSON object with a 'rankedThumbnails' key, containing an array of thumbnail objects sorted from the highest predicted CTR to the lowest.

Here are the thumbnails to analyze:
{{#each thumbnailDataUris}}
- Thumbnail {{@index}}: {{media url=this}}
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
