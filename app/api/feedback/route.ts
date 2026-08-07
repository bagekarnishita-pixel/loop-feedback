import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { classifyFeedback } from '@/lib/ai';
import { z } from 'zod';

// Zod schema for incoming feedback validation (Feature 5)
const createFeedbackSchema = z.object({
  content: z.string().min(1, "Content is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
  channel: z.string().optional(),
  customerLabel: z.string().optional(),
  userId: z.string().min(1, "User ID is required for RBAC check"), // RBAC ke liye userId zaroori hai
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    const sentiment = searchParams.get('sentiment');
    const featureArea = searchParams.get('featureArea');

    if (!workspaceId) {
      return NextResponse.json(
        { error: 'Missing required query parameter: workspaceId is required.' },
        { status: 400 }
      );
    }

    // Tenant Isolation Check (Feature 1)
    const whereClause: any = { workspaceId };
    if (sentiment) whereClause.sentiment = sentiment;
    if (featureArea) whereClause.featureArea = featureArea;

    const feedbackItems = await prisma.feedback.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    const totalCount = feedbackItems.length;
   const positiveCount = feedbackItems.filter((f: any) => f.sentiment === 'POSITIVE').length;
const negativeCount = feedbackItems.filter((f: any) => f.sentiment === 'NEGATIVE').length;
const neutralCount = feedbackItems.filter((f: any) => f.sentiment === 'NEUTRAL').length;
  const averageSentimentScore = totalCount > 0 
  ? feedbackItems.reduce((acc: any, f: any) => acc + (f.sentimentScore || 0), 0) / totalCount 
  : 0;
    return NextResponse.json(
      {
        success: true,
        metrics: {
          totalCount,
          positiveCount,
          negativeCount,
          neutralCount,
          averageSentimentScore: Number(averageSentimentScore.toFixed(2)),
        },
        data: feedbackItems,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching feedback:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while retrieving feedback.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Zod Validation to prevent bad inputs (Feature 5)
    const validationResult = createFeedbackSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { content, channel, workspaceId, customerLabel, userId } = validationResult.data;

    // --- RBAC BACKEND CHECK (Feature 2) ---
    // Check karein ki user database mein exist karta hai ya nahi aur uska role VIEWER toh nahi hai
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, workspaceId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: User not found.' }, { status: 401 });
    }

    // Agar user VIEWER hai, toh data modify/create karne ki ijazat nahi hai (403 Forbidden)
    if (user.role === 'VIEWER') {
      return NextResponse.json(
        { error: 'Forbidden: Viewers do not have permission to create or modify feedback.' },
        { status: 403 }
      );
    }
    // ---------------------------------------

    // Tenant Isolation when fetching existing themes
    const existingFeedback = await prisma.feedback.findMany({
      where: { workspaceId },
      select: { themes: true },
    });
    
    const existingThemes = Array.from(
      new Set(existingFeedback.flatMap((f) => f.themes))
    );

    const aiClassification = await classifyFeedback(content, existingThemes);

    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        channel: channel || 'WEB_FORM',
        workspaceId, // Tenant Isolation enforced here too
        customerLabel: customerLabel || 'Anonymous',
        status: 'NEW',
        sentiment: aiClassification.sentiment,
        sentimentScore: aiClassification.sentimentScore,
        themes: aiClassification.themes,
        featureArea: aiClassification.featureArea,
        aiRationale: aiClassification.rationale,
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Feedback successfully analyzed and stored.', 
        data: newFeedback 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing feedback ingestion:', error);
    return NextResponse.json(
      { error: 'Internal Server Error while processing feedback.' },
      { status: 500 }
    );
  }
}