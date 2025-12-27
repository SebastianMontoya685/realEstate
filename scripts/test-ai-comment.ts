/**
 * Test script for AI Comment Generation
 * 
 * Run with: npx tsx scripts/test-ai-comment.ts
 * 
 * Make sure you have OPENAI_API_KEY set in your .env file!
 */

import OpenAI from "openai";
import * as dotenv from "dotenv";
import * as readline from "readline";

// Load environment variables from .env file
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ Error: OPENAI_API_KEY is not set in your .env file");
  console.log("\nPlease add your OpenAI API key to the .env file:");
  console.log('OPENAI_API_KEY="your-api-key-here"');
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Tone descriptions for the AI
const toneDescriptions: Record<string, string> = {
  professional: "professional and insightful, showing expertise",
  friendly: "warm, approachable, and personable",
  enthusiastic: "excited and energetic, showing genuine interest",
  casual: "relaxed and conversational, like talking to a friend",
  supportive: "encouraging and uplifting, celebrating their achievement",
};

async function generateComment(
  postContent: string,
  postAuthor?: string,
  tone: string = "friendly"
): Promise<string> {
  const systemPrompt = `You are a LinkedIn user writing authentic, engaging comments on posts. 
Your comments should:
- Sound natural and human, NOT robotic or AI-generated
- Be ${toneDescriptions[tone] || toneDescriptions.friendly}
- Add value to the conversation (insight, question, or genuine reaction)
- Be concise but meaningful (aim for 200 characters max)
- Never use generic phrases like "Great post!" or "Thanks for sharing!"
- Match the energy and context of the original post
- Feel like a real person wrote it

IMPORTANT: Write ONLY the comment text, no quotes or extra formatting.`;

  const userPrompt = `Write a LinkedIn comment for this post${postAuthor ? ` by ${postAuthor}` : ""}:

"${postContent}"

Remember: Be authentic, add value, and sound human.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 150,
    temperature: 0.8,
  });

  return completion.choices[0]?.message?.content?.trim() ?? "";
}

async function generateVariations(
  postContent: string,
  postAuthor?: string
): Promise<Array<{ tone: string; comment: string }>> {
  const tones = ["professional", "friendly", "enthusiastic", "casual", "supportive"];
  
  console.log("\n⏳ Generating 5 comment variations...\n");

  const variations = await Promise.all(
    tones.map(async (tone) => {
      const comment = await generateComment(postContent, postAuthor, tone);
      return { tone, comment };
    })
  );

  return variations;
}

async function interactiveMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };

  console.log("\n🤖 LinkedIn AI Comment Generator - Test Mode\n");
  console.log("=" .repeat(50));
  console.log("This tool generates authentic LinkedIn comments using AI.");
  console.log("=" .repeat(50));

  try {
    // Test OpenAI connection first
    console.log("\n⏳ Testing OpenAI connection...");
    const models = await openai.models.list();
    console.log("✅ OpenAI connection successful!");
    console.log(`   Models available: ${models.data.length}`);

    while (true) {
      console.log("\n" + "-".repeat(50));
      
      const postContent = await question("\n📝 Enter the LinkedIn post content (or 'quit' to exit):\n> ");
      
      if (postContent.toLowerCase() === "quit" || postContent.toLowerCase() === "exit") {
        console.log("\n👋 Goodbye!");
        break;
      }

      if (postContent.trim().length < 10) {
        console.log("⚠️  Please enter a longer post content (at least 10 characters)");
        continue;
      }

      const postAuthor = await question("\n👤 Enter the post author's name (optional, press Enter to skip):\n> ");

      const mode = await question("\n🎯 Generate (1) single comment or (2) multiple variations? [1/2]:\n> ");

      if (mode === "2") {
        const variations = await generateVariations(postContent, postAuthor || undefined);
        
        console.log("=" .repeat(50));
        console.log("📊 Generated Comment Variations:");
        console.log("=" .repeat(50));
        
        variations.forEach(({ tone, comment }, index) => {
          console.log(`\n${index + 1}. [${tone.toUpperCase()}]`);
          console.log(`   "${comment}"`);
        });
      } else {
        const toneChoice = await question(`
🎨 Choose a tone:
   1. Professional
   2. Friendly
   3. Enthusiastic
   4. Casual
   5. Supportive
Enter number [1-5, default 2]: `);

        const toneMap: Record<string, string> = {
          "1": "professional",
          "2": "friendly",
          "3": "enthusiastic",
          "4": "casual",
          "5": "supportive",
        };

        const tone = toneMap[toneChoice] || "friendly";
        
        console.log(`\n⏳ Generating ${tone} comment...`);
        
        const comment = await generateComment(postContent, postAuthor || undefined, tone);
        
        console.log("\n" + "=" .repeat(50));
        console.log("✨ Generated Comment:");
        console.log("=" .repeat(50));
        console.log(`\n"${comment}"\n`);
      }
    }
  } catch (error) {
    console.error("\n❌ Error:", error instanceof Error ? error.message : error);
  } finally {
    rl.close();
  }
}

// Run a quick demo if --demo flag is passed
async function runDemo() {
  console.log("\n🎬 Running Demo Mode...\n");
  
  const samplePost = `Just shipped a new feature that our users have been asking for months! 
The journey from idea to production was challenging, but seeing the positive feedback makes it all worth it. 
Remember: the best time to start is now. #buildinpublic #startups`;

  const sampleAuthor = "Sarah Chen";

  console.log("📝 Sample Post:");
  console.log(`"${samplePost}"`);
  console.log(`\n👤 Author: ${sampleAuthor}`);

  const variations = await generateVariations(samplePost, sampleAuthor);
  
  console.log("\n" + "=" .repeat(50));
  console.log("📊 Generated Comment Variations:");
  console.log("=" .repeat(50));
  
  variations.forEach(({ tone, comment }, index) => {
    console.log(`\n${index + 1}. [${tone.toUpperCase()}]`);
    console.log(`   "${comment}"`);
  });

  console.log("\n✅ Demo complete!\n");
}

// Main entry point
const args = process.argv.slice(2);

if (args.includes("--demo")) {
  runDemo().catch(console.error);
} else {
  interactiveMode().catch(console.error);
}

