import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { parse } from "csv-parse/sync";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const workspaceId = formData.get("workspaceId") as string;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // 1. File Size & Format Constraints Validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB limit
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ success: false, error: "File size exceeds the 5MB limit." }, { status: 400 });
    }

    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      return NextResponse.json({ success: false, error: "Invalid file format. Only .csv files are supported." }, { status: 400 });
    }

    const text = await file.text();
    
    let records;
    try {
      records = parse(text, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
    } catch (err: any) {
      return NextResponse.json({ success: false, error: "Failed to parse CSV format. Check column headers." }, { status: 400 });
    }

    // 2. Column Validation (Check if required headers exist)
    if (records.length > 0) {
      const firstRow = records[0] as any;
      if (!firstRow.content) {
        return NextResponse.json({ 
          success: false, 
          error: "Invalid CSV structure. Missing required 'content' column." 
        }, { status: 400 });
      }
    }

    let successCount = 0;
    let failureCount = 0;
    const errors: any[] = [];

    for (let i = 0; i < records.length; i++) {
const row = records[i] as any;
      try {
        if (!row.content || row.content.trim() === "") {
          throw new Error(`Row ${i + 1}: Content is empty`);
        }

        // 3. Duplicate Detection / Merging (Check if same content already exists in workspace)
        const existingFeedback = await db.feedback.findFirst({
          where: {
            workspaceId: workspaceId || "default-workspace",
            text: row.text,
          },
        });

        if (existingFeedback) {
          // Duplicate found: Skip insertion or merge count
          failureCount++;
          errors.push({ row: i + 1, error: "Duplicate feedback skipped" });
          continue;
        }

        await db.feedback.create({
          data: {
            title: row.title || "Bulk Upload Feedback",
            content: row.content,
            sentiment: row.sentiment || "NEUTRAL",
            featureArea: row.featureArea || "General",
            workspaceId: workspaceId || "default-workspace",
          },
        });
        successCount++;
      } catch (err: any) {
        failureCount++;
        errors.push({ row: i + 1, error: err.message });
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: records.length,
        successCount,
        failureCount,
        errors,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}