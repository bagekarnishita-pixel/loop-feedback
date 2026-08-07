"use client";

import React, { useState } from "react";
import { Sparkles, Send, CheckSquare, MessageSquare, Bot, User } from "lucide-react";

interface Message {
  id: number;
  sender: "ai" | "user";
  text: string;
  time: string;
}

const suggestedInsights = [
  { id: 1, title: "Spike in negative billing feedback" },
  { id: 2, title: "Top feature requests from App Store" },
  { id: 3, title: "User drop-off analysis on checkout" },
  { id: 4, title: "Customer sentiment shift this week" },
];

export default function AskAIPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your LOOP AI customer assistant. Ask me questions like: 'Why are users complaining about billing?' or select one of the suggested insights on the right.",
      time: "Just now",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSendMessage = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setIsGenerating(true);

    // Simulate AI response based on feedback data
    setTimeout(() => {
      let aiReply = "Based on recent multi-channel feedback data, users are generally satisfied with the interface, but a few have reported specific bottlenecks.";
      
      const lower = queryText.toLowerCase();
      if (lower.includes("billing") || lower.includes("negative")) {
        aiReply = "AI Clustering detected a 14% rise in billing complaints linked to gateway timeouts during peak evening hours.";
      } else if (lower.includes("feature") || lower.includes("store")) {
        aiReply = "App Store feedback highlights high demand for dark-mode scheduling and direct CSV custom exports.";
      } else if (lower.includes("checkout") || lower.includes("drop-off")) {
        aiReply = "Checkout friction is primarily driven by slow mobile responsiveness and missing regional currency options.";
      } else if (lower.includes("sentiment")) {
        aiReply = "Overall customer sentiment this week stands at 68% Positive, 22% Neutral, and 10% Negative.";
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-blue-400" /> Ask LOOP AI Assistant
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Query real-time feedback insights, check AI theme classifications, and audit sentiment data.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left / Center: Live Conversation History */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 flex flex-col h-[650px] shadow-xl">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800 text-xs font-semibold text-slate-400">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span>LIVE CONVERSATION HISTORY</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : ""}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === "ai" ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" : "bg-slate-800 text-slate-300 border border-slate-700"
                }`}>
                  {msg.sender === "ai" ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                <div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "ai"
                      ? "bg-slate-950/80 text-slate-200 border border-slate-800/80 shadow-inner"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  }`}>
                    {msg.text}
                  </div>
                  <span className={`block text-[10px] text-slate-500 mt-1 ${msg.sender === "user" ? "text-right" : ""}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                  <Bot className="w-4 h-4 animate-spin" />
                </div>
                <div className="px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-slate-400 flex items-center gap-2">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-100">●</span>
                  <span className="animate-pulse delay-200">●</span>
                  Analyzing feedback database...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="pt-4 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputQuery);
              }}
              className="relative flex items-center"
            >
              <input
                type="text"
                placeholder="Ask LOOP AI anything about customer feedback..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-3 rounded-xl bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Suggested Insights Checklist */}
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 flex flex-col justify-between shadow-xl h-[650px]">
          <div>
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800 text-xs font-semibold text-slate-400">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>SUGGESTED INSIGHTS</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-4 mb-4">
              Select checklist items below to run instant AI audit summaries on feedback trends.
            </p>

            <div className="space-y-3">
              {suggestedInsights.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSendMessage(item.title)}
                  className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-950 transition-all cursor-pointer group flex items-start gap-3 shadow-sm"
                >
                  <input
                    type="checkbox"
                    readOnly
                    checked={false}
                    className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-xs text-slate-300 group-hover:text-white font-medium leading-relaxed">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-400 leading-normal">
            <span className="font-semibold text-indigo-400 block mb-1">💡 Pro Tip</span>
            You can click any suggestion card above to instantly query the dataset without typing manually.
          </div>
        </div>

      </div>
    </div>
  );
}