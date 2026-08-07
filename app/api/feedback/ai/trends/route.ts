import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Workspace ID is required for theme clustering.' },
        { status: 400 }
      );
    }

    // 1. Fetch feedback items for the specific workspace (Tenant Isolation)
    const feedbacks = await prisma.feedback.findMany({
      where: { workspaceId },
      select: { content: true, sentiment: true, createdAt: true, featureArea: true },
      take: 100, // Analyze up to recent 100 items
    });

    if (feedbacks.length === 0) {
      return NextResponse.json({ success: true, themes: [], message: "No feedback found to cluster." });
    }

    // 2. Prepare text payload for Groq
    const feedbackTexts = feedbacks.map((f, i) => `[${i+1}] (${f.sentiment}) ${f.content}`).join("\n");

    const prompt = `Analyze the following customer feedback items and group them into 3 to 5 distinct, meaningful named themes (e.g., "Onboarding complaints", "UI/UX enhancements", "Billing issues"). 
    For each theme, provide:
    - themeName: string
    - count: number of feedback items belonging to this theme roughly
    - trend: "GROWING", "STABLE", or "DECLINING" based on recent sentiment/mentions
    - summary: a short 1-sentence summary of the user sentiment in this theme.

    Return ONLY a valid JSON array of objects with keys: themeName, count, trend, summary. No markdown or extra text, just raw JSON.

    Feedback Data:
    ${feedbackTexts}`;

    // 3. Call Groq API (using llama model)
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile", // Ya aapka jo Groq model configured ho
      temperature: 0.3,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || "[]";

    // Parse AI response safely
    let clusteredThemes = [];
    try {
      // Clean up potential markdown formatting in response
      const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      clusteredThemes = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('Failed to parse Groq theme clustering response:', responseText);
      clusteredThemes = [{ themeName: "General Feedback", count: feedbacks.length, trend: "STABLE", summary: "General user comments and requests." }];
    }

    return NextResponse.json({
      success: true,
      data: {
        totalAnalyzed: feedbacks.length,
        themes: clusteredThemes,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error in Groq AI theme clustering:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during AI clustering.' },
      { status: 500 }
    );
  }
}