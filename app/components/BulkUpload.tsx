"use client";
import { useState } from "react";

export default function BulkUploadComponent({ workspaceId }: { workspaceId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspaceId", workspaceId);

    try {
      const res = await fetch("/api/feedback/bulk-upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setReport(data.summary);

      // FileReader se CSV ki SAARI rows ko read karke sahi order mein save karein
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const lines = text.split("\n").map(l => l.trim()).filter(l => l !== "");
          const rows = lines.slice(1); // Header row chhod kar baaki rows

          const parsedItems = rows.map((row, index) => {
            const cols = row.split(",").map(c => c.replace(/^["']|["']$/g, "").trim());
            return {
              id: Date.now() + index,
              text: cols[0] || "Imported Feedback",     // 1st Column: Feedback Text
              channel: cols[1] || "App Store",          // 2nd Column: Channel
              sentiment: cols[2] || "Neutral",        // 3rd Column: Sentiment
              status: "NEW",
            };
          });

          if (parsedItems.length > 0) {
            // Purane feedbacks ke sath naye uploaded feedbacks ko combine karein taaki saare dikhein
            const existing = JSON.parse(localStorage.getItem("loop_feedbacks") || "[]");
            const combined = [...parsedItems, ...existing];
            localStorage.setItem("loop_feedbacks", JSON.stringify(combined));
          }
        }
      };
      reader.readAsText(file);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
      <h3 className="text-lg font-medium mb-2">Upload Feedback CSV</h3>
      <form onSubmit={handleUpload} className="space-y-4">
        <input 
          type="file" 
          accept=".csv" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
        <button 
          type="submit" 
          disabled={loading || !file}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </form>

      {report && (
        <div className="mt-4 p-3 bg-muted rounded text-sm">
          <p><strong>Total Processed:</strong> {report.total}</p>
          <p className="text-green-600"><strong>Success:</strong> {report.successCount}</p>
          <p className="text-red-600"><strong>Failed:</strong> {report.failureCount}</p>
        </div>
      )}
    </div>
  );
}