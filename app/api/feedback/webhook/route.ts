import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, sentiment, featureArea, workspaceId, source } = body;

    if (!content) {
      return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });
    }

    const newFeedback = await db.feedback.create({
      data: {
        text: content, // 'content' ko 'text' mein map kar diya gaya hai
        sentiment: sentiment || "NEUTRAL",
        featureArea: featureArea || "General",
        workspaceId: workspaceId || "default-workspace",
        // 'title' ko yahan se puri tarah hata diya gaya hai kyunki wo schema mein nahi hai
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