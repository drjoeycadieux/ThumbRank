'use server';

/**
 * @fileOverview Explains the ranking of YouTube thumbnails based on predicted click-through rate.
 *
 * - explainRanking - A function that takes an array of thumbnail data URIs and returns a ranked list with explanations.
 * - ExplainRankingInput - The input type for the explainRanking function.
 * - ExplainRankingOutput - The output type for the explainRanking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRankingInputSchema = z.array(
  z
    .string()
    .describe(
      "A YouTube thumbnail image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    )
);
export type ExplainRankingInput = z.infer<typeof ExplainRankingInputSchema>;

const ExplainRankingOutputSchema = z.array(
  z.object({
    thumbnailDataUri: z
      .string()
      .describe(
        "The YouTube thumbnail image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
      ),
    rank: z.number().describe('The rank of the thumbnail (1 being the highest).'),
    explanation: z.string().describe('The AI explanation for the ranking.'),
  })
);
export type ExplainRankingOutput = z.infer<typeof ExplainRankingOutputSchema>;

export async function explainRanking(input: ExplainRankingInput): Promise<ExplainRankingOutput> {
  return explainRankingFlow(input);
}

const explainRankingPrompt = ai.definePrompt({
  name: 'explainRankingPrompt',
  input: {schema: ExplainRankingInputSchema},
  output: {schema: ExplainRankingOutputSchema},
  prompt: `You are an expert YouTube thumbnail ranking specialist. You are given a set of YouTube thumbnail images. You must rank the thumbnails from best to worst in terms of predicted click-through rate, and explain the reasons for your ranking.

Here are the thumbnails:

{{#each this}}
{{@index}}. {{media url=this}}
{{/each}}

Return a JSON array of thumbnail objects, ranked from best to worst. Each object should include the thumbnail's data URI, its rank (1 being the highest), and an explanation for the ranking. Be concise. Focus on why one thumbnail might perform better than another. Consider factors like visual appeal, relevance to the video content, and overall design.
`,
});

const explainRankingFlow = ai.defineFlow(
  {
    name: 'explainRankingFlow',
    inputSchema: ExplainRankingInputSchema,
    outputSchema: ExplainRankingOutputSchema,
  },
  async input => {
    const {output} = await explainRankingPrompt(input);
    return output!;
  }
);
