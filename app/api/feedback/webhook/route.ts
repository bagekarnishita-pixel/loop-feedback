import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, sentiment, featureArea, workspaceId, source } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
    }

    const newFeedback = await db.feedback.create({
      data: {
        title: title || `Webhook Feedback from ${source || 'External API'}`,
        content,
        sentiment: sentiment || "NEUTRAL",
        featureArea: featureArea || "General",
        workspaceId: workspaceId || "default-workspace",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Feedback ingested successfully via Webhook/API",
      data: newFeedback,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}