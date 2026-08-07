"use client";

import React, { useState, useEffect } from "react";
import { FileText, Download, Check, Sparkles } from "lucide-react";

export default function VocReportsPage() {
  const [isReportGenerated, setIsReportGenerated] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  // Live Calculated State
  const [totalCount, setTotalCount] = useState(0);
  const [sentimentText, setSentimentText] = useState("0% Positive / 0% Negative");
  const [topIssue, setTopIssue] = useState("No major issues found");
  const [keyThemes, setKeyThemes] = useState<string[]>([]);

  const handleGenerateReport = () => {
    const saved = localStorage.getItem("loop_feedbacks");
    const feedbacks = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      setTotalCount(0);
      setSentimentText("0% Positive / 0% Negative");
      setTopIssue("No data available");
      setKeyThemes(["Please upload or add feedbacks via dashboard first."]);
      setIsReportGenerated(true);
      return;
    }

    // 1. Total Count
    const total = feedbacks.length;
    setTotalCount(total);

    // 2. Sentiment Ratios
    let pos = 0;
    let neg = 0;
    const themeCounts: { [key: string]: number } = {};

    feedbacks.forEach((item: any) => {
      const sent = (item.sentiment || "").toLowerCase();
      if (sent.includes("pos")) pos++;
      else if (sent.includes("neg")) neg++;

      const theme = item.tag || item.theme || item.channel || "General";
      themeCounts[theme] = (themeCounts[theme] || 0) + 1;
    });

    const posPercent = Math.round((pos / total) * 100);
    const negPercent = Math.round((neg / total) * 100);
    setSentimentText(`${posPercent}% Positive / ${negPercent}% Negative`);

    // 3. Top Priority Issue (Negative or highest frequency theme)
    const sortedThemes = Object.entries(themeCounts).sort((a: any, b: any) => b[1] - a[1]);
    if (sortedThemes.length > 0) {
      setTopIssue(`High focus required on: ${sortedThemes[0][0]}`);
    } else {
      setTopIssue("Stable performance across channels");
    }

    // 4. Dynamic Themes & Recommendations
    const dynamicBullets = sortedThemes.slice(0, 3).map(([theme, count]) => 
      `Active discussion volume high on "${theme}" with ${count} logged entries.`
    );
    
    if (dynamicBullets.length === 0) {
      dynamicBullets.push("System running smoothly with standard engagement levels.");
    }
    
    setKeyThemes(dynamicBullets);
    setIsReportGenerated(true);
  };

  const handleExportPDF = () => {
    window.print();
    setExportStatus("PDF");
    setTimeout(() => setExportStatus(null), 3000);
    setIsExportOpen(false);
  };

  const handleExportCSV = () => {
    const saved = localStorage.getItem("loop_feedbacks");
    const feedbacks = saved ? JSON.parse(saved) : [];

    if (feedbacks.length === 0) {
      alert("No feedback data available to export.");
      return;
    }

    const headers = ["ID", "Feedback", "Sentiment", "Tag", "Channel"];
    const csvRows = [
      headers.join(","),
      ...feedbacks.map((item: any, index: number) => 
        `"${index + 1}","${(item.text || "").replace(/"/g, '""')}","${item.sentiment || 'Neutral'}","${item.tag || 'General'}","${item.channel || 'Direct'}"`
      )
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `voc_live_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportStatus("CSV");
    setTimeout(() => setExportStatus(null), 3000);
    setIsExportOpen(false);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          Automated VoC Reports Generator & Export
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Generate automated AI periodic digests synthesizing live feedback metrics, sentiment ratios, and core themes for stakeholders.
        </p>
      </div>

      {/* Generator Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            Weekly VoC Digest Generator
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Click below to synthesize your live customer feedback trends into a comprehensive professional report card.
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Live Report</span>
        </button>
      </div>

      {/* Generated Report Card Section */}
      {isReportGenerated && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
          
          {/* Top Bar inside Card */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-800 gap-4">
            <div>
              <h2 className="text-lg font-bold text-white">
                Executive Voice of Customer Summary (Live Data Sync)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Synthesized via LOOP AI Engine from Live Storage</p>
            </div>

            {/* Export Dropdown Container */}
            <div className="relative">
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
                {exportStatus && (
                  <span className="ml-1 text-[10px] bg-white text-emerald-700 px-1.5 py-0.5 rounded-full flex items-center gap-1 font-bold">
                    <Check className="w-3 h-3"/> {exportStatus} Saved
                  </span>
                )}
              </button>

              {isExportOpen && (
                <div className="absolute right-0 top-12 w-52 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-left">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    Select Format
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition mt-1 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-bold">Export as CSV</div>
                      <div className="text-[10px] text-slate-400">Spreadsheet table</div>
                    </div>
                  </button>
                  <button
                    onClick={handleExportPDF}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-blue-400" />
                    <div>
                      <div className="font-bold">Export as PDF / Print</div>
                      <div className="text-[10px] text-slate-400">Browser print layout</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Total Feedback Analyzed
              </div>
              <div className="text-3xl font-extrabold text-white">{totalCount} items</div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Sentiment Ratio
              </div>
              <div className="text-lg font-extrabold text-emerald-400 mt-1">
                {sentimentText}
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-xl">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Top Priority Issue
              </div>
              <div className="text-sm font-bold text-red-400 mt-1">{topIssue}</div>
            </div>
          </div>

          {/* Key Themes Section */}
          <div className="bg-slate-950/60 border border-slate-800/60 rounded-xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Key Themes & Stakeholder Recommendations
            </div>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              {keyThemes.map((theme, idx) => (
                <li key={idx}>{theme}</li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
}