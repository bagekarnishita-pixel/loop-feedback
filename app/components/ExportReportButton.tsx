"use client";

import React, { useState } from "react";
import { Download, FileText, FileSpreadsheet, Check } from "lucide-react";

export default function ExportReportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadedType, setDownloadedType] = useState<string | null>(null);

  const handleExportCSV = () => {
    const saved = localStorage.getItem("loop_feedbacks");
    const feedbacks = saved ? JSON.parse(saved) : [
      { id: 1, text: "UI glitch on login", sentiment: "Negative", tag: "UI/UX Design", channel: "App Store" },
      { id: 2, text: "Love the dark mode feature!", sentiment: "Positive", tag: "Dark Mode", channel: "Twitter" }
    ];

    if (!feedbacks || feedbacks.length === 0) {
      alert("No feedback data available to export.");
      return;
    }

    const headers = ["ID", "Feedback", "Sentiment", "Tag", "Channel"];
    const csvRows = [
      headers.join(","),
      ...feedbacks.map((item: any, index: number) => 
        `"${index + 1}","${(item.text || item.feedback || "").replace(/"/g, '""')}","${item.sentiment || 'Neutral'}","${item.tag || item.theme || 'General'}","${item.channel || 'Direct'}"`
      )
    ];

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `voc_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedType("CSV");
    setTimeout(() => setDownloadedType(null), 3000);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    window.print();
    setDownloadedType("PDF");
    setTimeout(() => setDownloadedType(null), 3000);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span>Export Report</span>
        {downloadedType && <span className="ml-1 text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3"/> Saved</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            Choose Format
          </div>
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition text-left cursor-pointer mt-1"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="font-bold">Export as CSV</div>
              <div className="text-[10px] text-slate-400">Spreadsheet compatible format</div>
            </div>
          </button>
          <button
            onClick={handleExportPDF}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-slate-200 hover:bg-slate-800 transition text-left cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <div>
              <div className="font-bold">Export as PDF / Print</div>
              <div className="text-[10px] text-slate-400">Save via browser print engine</div>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}