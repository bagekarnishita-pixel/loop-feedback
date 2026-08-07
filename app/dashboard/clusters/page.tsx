"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Search, RefreshCw, Layers, MessageSquare, Cpu } from "lucide-react";

interface ClusterItem {
  id: number;
  title: string;
  description: string;
  commentsCount: number;
  positive: number;
  neutral: number;
  negative: number;
  matchScore: string;
  timeAgo: string;
  accentColor: string;
}

const initialClusters: ClusterItem[] = [
  {
    id: 1,
    title: "Performance & Lags",
    description: "App freezing on heavy database queries and slow load times.",
    commentsCount: 14,
    positive: 1,
    neutral: 3,
    negative: 10,
    matchScore: "96%",
    timeAgo: "5 mins ago",
    accentColor: "from-amber-500 to-orange-600",
  },
  {
    id: 2,
    title: "Feature Requests",
    description: "Users asking for advanced export formats and calendar sync.",
    commentsCount: 8,
    positive: 6,
    neutral: 2,
    negative: 0,
    matchScore: "94%",
    timeAgo: "1 hour ago",
    accentColor: "from-blue-500 to-indigo-600",
  },
  {
    id: 3,
    title: "Checkout & Billing",
    description: "Payment gateway timeout issues and invoice mismatch reports.",
    commentsCount: 6,
    positive: 0,
    neutral: 1,
    negative: 5,
    matchScore: "98%",
    timeAgo: "3 hours ago",
    accentColor: "from-rose-500 to-pink-600",
  },
  {
    id: 4,
    title: "Integration Gaps",
    description: "Requests for seamless third-party webhooks and API extensions.",
    commentsCount: 5,
    positive: 3,
    neutral: 2,
    negative: 0,
    matchScore: "91%",
    timeAgo: "1 day ago",
    accentColor: "from-emerald-500 to-teal-600",
  },
];

export default function ThemeClustersPage() {
  const [clusters, setClusters] = useState<ClusterItem[]>(initialClusters);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Most Feedback");
  const [isClustering, setIsClustering] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("loop_theme_clusters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setClusters(parsed);
        }
      } catch (e) {
        console.error("Error loading clusters", e);
      }
    }
  }, []);

  const handleRunAI = () => {
    setIsClustering(true);
    setTimeout(() => {
      setIsClustering(false);
      // Simulate dynamic re-clustering
      const randomized = clusters.map(c => ({
        ...c,
        commentsCount: c.commentsCount + Math.floor(Math.random() * 3),
      }));
      setClusters(randomized);
      localStorage.setItem("loop_theme_clusters", JSON.stringify(randomized));
      alert("AI Clustering algorithm re-indexed all customer feedback successfully!");
    }, 1500);
  };

  const filteredClusters = clusters.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-400" /> AI Theme Clustering
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Underlying root causes and behavioral segments automatically aggregated from customer feedback.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunAI}
            disabled={isClustering}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-lg shadow-indigo-900/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isClustering ? "animate-spin" : ""}`} />
            {isClustering ? "Running AI Engine..." : "Run AI Clustering"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800 transition-colors cursor-pointer"
            title="Reload Clusters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl border border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-xl">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search theme clusters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs cursor-pointer"
          >
            <option>Most Feedback</option>
            <option>Highest Match %</option>
            <option>Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Cluster Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClusters.map((cluster) => (
          <div
            key={cluster.id}
            className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800/80 p-6 shadow-xl relative overflow-hidden group hover:border-slate-700 transition-all"
          >
            {/* Top Glowing Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${cluster.accentColor}`} />

            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  Theme Cluster
                </span>
                <h3 className="text-lg font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">
                  {cluster.title}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-full border border-slate-800">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-semibold text-white">{cluster.commentsCount}</span> Comments
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              {cluster.description}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-800/80 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium">SENTIMENT:</span>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {cluster.positive}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {cluster.neutral}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {cluster.negative}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                  <Cpu className="w-3 h-3" /> {cluster.matchScore} Match
                </span>
                <span>•</span>
                <span>{cluster.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}