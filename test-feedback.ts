import 'dotenv/config';
import prisma from "./lib/db";
import { classifyFeedback } from "./lib/ai";

async function testDirectIngestion() {
  const content = "The new dashboard layout is a bit confusing to navigate, and it took me forever to find the export button.";
  const channel = "SUPPORT_TICKET";
  const customerLabel = "test.user@example.com";
  const workspaceId = "my-first-workspace";

  try {
    console.log("0. Ensuring test workspace exists...");
    await prisma.workspace.upsert({
      where: { id: workspaceId },
      update: {},
      create: {
        id: workspaceId,
        name: "My First Workspace",
      },
    });

    console.log("1. Running Groq AI classification...");
    const aiClassification = await classifyFeedback(content, []);
    console.log("AI Result:", aiClassification);

    console.log("2. Saving feedback directly to Supabase via Prisma...");
    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        channel,
        workspaceId,
        customerLabel,
        status: 'NEW',
        sentiment: aiClassification.sentiment,
        sentimentScore: aiClassification.sentimentScore,
        themes: aiClassification.themes,
        featureArea: aiClassification.featureArea,
        aiRationale: aiClassification.rationale,
      },
    });

    console.log("SUCCESS! Saved Feedback Record:", JSON.stringify(newFeedback, null, 2));
  } catch (err) {
    console.error("Direct test failed:", err);
  }
}

testDirectIngestion();