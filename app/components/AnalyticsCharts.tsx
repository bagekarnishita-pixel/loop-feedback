"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function AnalyticsCharts() {
  // 🔥 Initial state ko 0 kar diya hai taaki purane hardcoded values na dikhein
  const [sentimentData, setSentimentData] = useState([
    { name: "Positive", value: 0, color: "#10b981" },
    { name: "Neutral", value: 0, color: "#f59e0b" },
    { name: "Negative", value: 0, color: "#ef4444" },
  ]);

  const [themeData, setThemeData] = useState([]);

  const [volumeData] = useState([
    { day: "Mon", volume: 12 },
    { day: "Tue", volume: 19 },
    { day: "Wed", volume: 15 },
    { day: "Thu", volume: 22 },
    { day: "Fri", volume: 28 },
    { day: "Sat", volume: 18 },
    { day: "Sun", volume: 25 },
  ]);

  const calculateAnalytics = () => {
    const saved = localStorage.getItem("loop_feedbacks");
    const feedbacks = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      setSentimentData([
        { name: "Positive", value: 0, color: "#10b981" },
        { name: "Neutral", value: 0, color: "#f59e0b" },
        { name: "Negative", value: 0, color: "#ef4444" },
      ]);
      setThemeData([]);
      return;
    }

    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;
    const themeCounts: { [key: string]: number } = {};

    feedbacks.forEach((item) => {
      // Case-insensitive check for sentiment
      const sent = (item.sentiment || "").trim().toLowerCase();
      if (sent.includes("pos")) {
        posCount++;
      } else if (sent.includes("neg")) {
        negCount++;
      } else {
        neuCount++;
      }

      // Grouping themes or channels
      const tag = item.tag || item.theme || item.channel || "General";
      themeCounts[tag] = (themeCounts[tag] || 0) + 1;
    });

    const total = feedbacks.length;
    const posPercent = Math.round((posCount / total) * 100);
    const negPercent = Math.round((negCount / total) * 100);
    const neuPercent = Math.max(0, 100 - (posPercent + negPercent));

    setSentimentData([
      { name: "Positive", value: posPercent, color: "#10b981" },
      { name: "Neutral", value: neuPercent, color: "#f59e0b" },
      { name: "Negative", value: negPercent, color: "#ef4444" },
    ]);

    const formattedThemes = Object.keys(themeCounts).map((themeName) => ({
      theme: themeName,
      count: themeCounts[themeName],
    }));

    if (formattedThemes.length > 0) {
      setThemeData(formattedThemes);
    }
  };

  useEffect(() => {
    calculateAnalytics();

    const handleStorageChange = () => {
      calculateAnalytics();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("local-storage-update", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("local-storage-update", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Volume Over Time */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Volume Over Time</h3>
            <p className="text-xs text-slate-400">Daily incoming feedback trends over the past week</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
                <Area type="monotone" dataKey="volume" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sentiment Breakdown */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Sentiment Breakdown</h3>
            <p className="text-xs text-slate-400">Proportion of positive, neutral, and negative feedback</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Chart 3: Top Themes */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-white">Top Themes / Channels</h3>
          <p className="text-xs text-slate-400">Most frequently discussed topics or channels by users</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={themeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} />
              <YAxis dataKey="theme" type="category" stroke="#94a3b8" fontSize={12} width={100} />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", color: "#fff" }} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}