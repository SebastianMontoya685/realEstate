import { z } from "zod";
import OpenAI from "openai";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const aiCommentRouter = createTRPCRouter({
  /**
   * Generate an AI comment for a LinkedIn post
   */
  generate: publicProcedure
    .input(
      z.object({
        postContent: z.string().min(1, "Post content is required"),
        postAuthor: z.string().optional(),
        tone: z
          .enum(["professional", "friendly", "enthusiastic", "casual", "supportive"])
          .default("friendly"),
        maxLength: z.number().min(50).max(500).default(200),
      }),
    )
    .mutation(async ({ input }) => {
      const { postContent, postAuthor, tone, maxLength } = input;

      const toneDescriptions: Record<string, string> = {
        professional: "professional and insightful, showing expertise",
        friendly: "warm, approachable, and personable",
        enthusiastic: "excited and energetic, showing genuine interest",
        casual: "relaxed and conversational, like talking to a friend",
        supportive: "encouraging and uplifting, celebrating their achievement",
      };

      const systemPrompt = `You are a LinkedIn user writing authentic, engaging comments on posts. 
Your comments should:
- Sound natural and human, NOT robotic or AI-generated
- Be ${toneDescriptions[tone]}
- Add value to the conversation (insight, question, or genuine reaction)
- Be concise but meaningful (aim for ${maxLength} characters max)
- Never use generic phrases like "Great post!" or "Thanks for sharing!"
- Match the energy and context of the original post
- Feel like a real person wrote it

IMPORTANT: Write ONLY the comment text, no quotes or extra formatting.`;

      const userPrompt = `Write a LinkedIn comment for this post${postAuthor ? ` by ${postAuthor}` : ""}:

"${postContent}"

Remember: Be authentic, add value, and sound human.`;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          max_tokens: 150,
          temperature: 0.8, // Higher for more creativity/variety
        });

        const generatedComment =
          completion.choices[0]?.message?.content?.trim() ?? "";

        if (!generatedComment) {
          throw new Error("Failed to generate comment");
        }

        return {
          success: true,
          comment: generatedComment,
          metadata: {
            tone,
            model: "gpt-4o-mini",
            tokensUsed: completion.usage?.total_tokens ?? 0,
          },
        };
      } catch (error) {
        console.error("OpenAI API Error:", error);
        throw new Error(
          error instanceof Error ? error.message : "Failed to generate comment",
        );
      }
    }),

  /**
   * Generate multiple comment variations for the user to choose from
   */
  generateVariations: publicProcedure
    .input(
      z.object({
        postContent: z.string().min(1, "Post content is required"),
        postAuthor: z.string().optional(),
        count: z.number().min(1).max(5).default(3),
      }),
    )
    .mutation(async ({ input }) => {
      const { postContent, postAuthor, count } = input;

      const tones = ["professional", "friendly", "enthusiastic", "casual", "supportive"];
      const selectedTones = tones.slice(0, count);

      const systemPrompt = `You are a LinkedIn user writing authentic, engaging comments.
Your comments should:
- Sound natural and human, NOT robotic
- Add value (insight, question, or genuine reaction)
- Be concise (under 200 characters)
- Never use generic phrases
- Feel like a real person wrote it

You will be given a tone to match. Write ONLY the comment text.`;

      const variations = await Promise.all(
        selectedTones.map(async (tone) => {
          const userPrompt = `Tone: ${tone}
Post${postAuthor ? ` by ${postAuthor}` : ""}: "${postContent}"

Write ONE ${tone} comment:`;

          const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            max_tokens: 100,
            temperature: 0.9,
          });

          return {
            tone,
            comment: completion.choices[0]?.message?.content?.trim() ?? "",
          };
        }),
      );

      return {
        success: true,
        variations: variations.filter((v) => v.comment.length > 0),
      };
    }),

  /**
   * Health check for the AI service
   */
  healthCheck: publicProcedure.query(async () => {
    try {
      // Simple test to verify API key works
      const models = await openai.models.list();
      return {
        status: "ok",
        message: "OpenAI connection successful",
        modelsAvailable: models.data.length > 0,
      };
    } catch (error) {
      return {
        status: "error",
        message: error instanceof Error ? error.message : "Connection failed",
        modelsAvailable: false,
      };
    }
  }),
});

