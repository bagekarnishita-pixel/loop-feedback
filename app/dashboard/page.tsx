"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BulkUploadComponent from "../components/BulkUpload";
import NotificationBell from "../components/NotificationBell";
import ExportReportButton from "../components/ExportReportButton";
import { Filter, ArrowRight } from "lucide-react";
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

export default function AnalyticsPage() {
  const router = useRouter();
  const [userRole, setUserRole] = useState("VIEWER");
  const [joinedDate, setJoinedDate] = useState("August 5, 2026");

  // Profile Dropdown state & ref for click outside
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dynamic states initialized with defaults or empty arrays
  const [sentimentData, setSentimentData] = useState([
    { name: "Positive", value: 64, color: "#10b981" },
    { name: "Neutral", value: 24, color: "#f59e0b" },
    { name: "Negative", value: 12, color: "#ef4444" },
  ]);

  const [themeData, setThemeData] = useState([
    { theme: "UI/UX Design", count: 45 },
    { theme: "Performance", count: 34 },
    { theme: "Login Bug", count: 25 },
    { theme: "Billing", count: 15 },
    { theme: "Dark Mode", count: 9 },
  ]);

  const [volumeData] = useState([
    { day: "Mon", volume: 12 },
    { day: "Tue", volume: 19 },
    { day: "Wed", volume: 15 },
    { day: "Thu", volume: 22 },
    { day: "Fri", volume: 28 },
    { day: "Sat", volume: 18 },
    { day: "Sun", volume: 25 },
  ]);

  const [totalVolume, setTotalVolume] = useState(128);
  const [positivePercentage, setPositivePercentage] = useState(64);

  // Pipeline stages state
  const [pipelineStages, setPipelineStages] = useState([
    {
      id: "incoming",
      title: "1. Received",
      count: 24,
      color: "bg-blue-500/10 text-blue-400",
      borderColor: "border-blue-500/30",
      desc: "Raw multi-channel feedback ingested",
    },
    {
      id: "ai_clustered",
      title: "2. AI Clustered",
      count: 18,
      color: "bg-indigo-500/10 text-indigo-400",
      borderColor: "border-indigo-500/30",
      desc: "Categorized by theme & sentiment",
    },
    {
      id: "in_review",
      title: "3. Under Review",
      count: 9,
      color: "bg-amber-500/10 text-amber-400",
      borderColor: "border-amber-500/30",
      desc: "Assigned to product/eng squads",
    },
    {
      id: "resolved",
      title: "4. Actioned & Resolved",
      count: 42,
      color: "bg-emerald-500/10 text-emerald-400",
      borderColor: "border-emerald-500/30",
      desc: "Patches deployed & closed",
    },
  ]);

  const handleSimulateProgress = () => {
    setPipelineStages((prev) =>
      prev.map((stage) => ({
        ...stage,
        count: stage.count + Math.floor(Math.random() * 3),
      }))
    );
  };

  // Function to calculate metrics and charts from localStorage data
  const calculateDashboardAnalytics = () => {
    const saved = localStorage.getItem("loop_feedbacks");
    const feedbacks = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(feedbacks) || feedbacks.length === 0) {
      setSentimentData([
        { name: "Positive", value: 0, color: "#10b981" },
        { name: "Neutral", value: 0, color: "#f59e0b" },
        { name: "Negative", value: 0, color: "#ef4444" },
      ]);
      setThemeData([]);
      setTotalVolume(0);
      setPositivePercentage(0);
      return;
    }

    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;
    const themeCounts: { [key: string]: number } = {};

    feedbacks.forEach((item) => {
      const sent = (item.sentiment || "").trim().toLowerCase();
      if (sent.includes("pos")) {
        posCount++;
      } else if (sent.includes("neg")) {
        negCount++;
      } else {
        neuCount++;
      }

      const tag = item.tag || item.theme || item.channel || "General";
      themeCounts[tag] = (themeCounts[tag] || 0) + 1;
    });

    const total = feedbacks.length;
    const posPercent = Math.round((posCount / total) * 100);
    const negPercent = Math.round((negCount / total) * 100);
    const neuPercent = Math.max(0, 100 - (posPercent + negPercent));

    setTotalVolume(total);
    setPositivePercentage(posPercent);

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
    // Sync Role, Email and Dynamic Registration/Joining Date from LocalStorage
    const updateRoleFromStorage = () => {
      const email = localStorage.getItem("userEmail") || "";
      const adminEmails = ["admin@loop.com", "boss@loop.com", "nishita@loop.com"];
      
      if (adminEmails.includes(email.toLowerCase())) {
        localStorage.setItem("userRole", "ADMIN");
        setUserRole("ADMIN");
      } else {
        const role = localStorage.getItem("userRole");
        if (role) {
          setUserRole(role);
        }
      }

      let storedDate = localStorage.getItem("userJoinedDate");
      if (!storedDate) {
        const currentDate = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
        localStorage.setItem("userJoinedDate", currentDate);
        storedDate = currentDate;
      }
      setJoinedDate(storedDate);
    };

    updateRoleFromStorage();
    calculateDashboardAnalytics();

    const handleStorageChange = () => {
      updateRoleFromStorage();
      calculateDashboardAnalytics();
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

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top Header Section with Role & Interactive Profile Popover */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-slate-800/80 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              Workspace // Production
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Executive Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time Voice of Customer intelligence, automated sentiment tracking, and cross-channel metrics.
          </p>
        </div>
        
        {/* Right Side: Export Report + Notification Bell + Live Sync + Role Badge + Interactive Profile Symbol */}
        <div className="flex items-center gap-3 flex-wrap relative" ref={profileRef}>
          
          {/* Export Report Dropdown Button */}
          <ExportReportButton />

          {/* Notification Bell Component */}
          <NotificationBell />

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300">Live Sync Active</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs text-slate-400">Role:</span>
            <span className="text-xs font-bold text-indigo-400 uppercase">{userRole}</span>
          </div>

          {/* Profile Avatar Symbol Button */}
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-slate-700 hover:scale-105 transition cursor-pointer"
          >
            NB
          </button>

          {/* Profile Dropdown Popover Card */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
                  ∞
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">Nishita Bagekar</div>
                  <div className="text-xs text-slate-400 truncate">{typeof window !== "undefined" ? localStorage.getItem("userEmail") || "admin@loop.com" : "admin@loop.com"}</div>
                </div>
              </div>

              <div className="py-4 space-y-3 text-xs border-b border-slate-800">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>📖</span> Workspace:
                  </span>
                  <span className="font-bold text-white">Production LLP</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>🛡️</span> Role:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold text-[10px] uppercase">{userRole}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>📅</span> Joined:
                  </span>
                  <span className="font-semibold text-slate-200">{joinedDate}</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>🚪</span> Logout
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CSV Bulk Upload Component Section */}
      <div className="mb-8">
        <BulkUploadComponent workspaceId="default-workspace" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Feedback Volume</span>
            <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs font-bold">📊 Metric</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-white tracking-tight">{totalVolume}</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Aggregated across App Store, Twitter, & Email</p>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Positive Sentiment Ratio</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold">💬 Sentiment</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-emerald-400 tracking-tight">{positivePercentage}%</span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Optimal</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Real-time sentiment calculation</p>
        </div>

        <div className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Actioned Backlog Items</span>
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold">⚡ Workflow</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-extrabold text-indigo-400 tracking-tight">42</span>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">8 pending</span>
          </div>
          <p className="text-xs text-slate-500 mt-3">Resolved by product & engineering squads</p>
        </div>
      </div>

      {/* Feedback Status Pipeline Section */}
      <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800 p-6 shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-indigo-400 uppercase">
              <Filter className="w-3.5 h-3.5" /> Operations Pipeline
            </div>
            <h2 className="text-lg font-bold text-white mt-1">Feedback Resolution Lifecycle</h2>
          </div>
          <button
            onClick={handleSimulateProgress}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            Sync Live Pipeline Data
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.id}
              className={`bg-slate-950/80 rounded-xl p-5 border ${stage.borderColor} relative group hover:border-slate-600 transition-all shadow-inner`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${stage.color} ${stage.borderColor}`}>
                  {stage.title}
                </span>
                <span className="text-2xl font-black text-white">{stage.count}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {stage.desc}
              </p>
              {idx < pipelineStages.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recharts Section */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Top Themes / Channels</h3>
            <p className="text-xs text-slate-400">Most frequently discussed topics by users</p>
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

    </div>
  );
}