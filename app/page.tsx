"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  // Interactive Workspace Tabs state
  const [activeTab, setActiveTab] = useState(0);
  
  // Profile Dropdown state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const workspaceTabs = [
    {
      id: "analytics",
      name: "Analytics Dashboard",
      icon: "📊",
      title: "Real-Time VoC Analytics",
      description: "Track customer sentiment ratios, feedback volume spikes, and cross-channel metrics instantly.",
      previewContent: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Total Volume</div>
            <div className="text-2xl font-black text-white">1,482</div>
            <div className="text-xs text-emerald-400 mt-2">↑ 18% this week</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Positive Ratio</div>
            <div className="text-2xl font-black text-emerald-400">76%</div>
            <div className="text-xs text-emerald-400 mt-2">Optimal health</div>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400 mb-1">Open Backlog</div>
            <div className="text-2xl font-black text-indigo-400">12 Items</div>
            <div className="text-xs text-amber-400 mt-2">Needs review</div>
          </div>
        </div>
      ),
    },
    {
      id: "inbox",
      name: "Feedback Inbox",
      icon: "📥",
      title: "Unified Customer Inbox",
      description: "All comments from App Store, Twitter, Support Emails, and CSV uploads organized in one stream.",
      previewContent: (
        <div className="p-6 space-y-3">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">"The new dark mode update is incredible! Great work team."</span>
            <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold">Positive</span>
          </div>
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-medium">"Login button sometimes lags on mobile Safari view."</span>
            <span className="bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-lg border border-amber-500/20 font-bold">Neutral</span>
          </div>
        </div>
      ),
    },
    {
      id: "ai",
      name: "Ask LOOP AI",
      icon: "🤖",
      title: "AI-Powered Prompt Engine",
      description: "Ask natural language questions against your indexed database of customer comments.",
      previewContent: (
        <div className="p-6 space-y-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            <span className="text-blue-400 font-bold">You: </span> What are the top billing complaints this month?
          </div>
          <div className="bg-blue-600/10 p-3 rounded-xl border border-blue-500/20 text-xs text-blue-200">
            <span className="font-bold text-blue-400">LOOP AI: </span> 64% of billing complaints relate to invoice PDF downloads failing on Safari. Suggested fix is queued in backlog.
          </div>
        </div>
      ),
    },
    {
      id: "clustering",
      name: "Theme Clustering",
      icon: "🏷️",
      title: "Automated Theme Categorization",
      description: "Automatically group unstructured user reviews into actionable product themes.",
      previewContent: (
        <div className="p-6 space-y-2.5">
          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300">UI / UX Design</span>
            <div className="w-1/2 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-4/5"></div>
            </div>
          </div>
          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300">Performance & Speed</span>
            <div className="w-1/2 bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full w-3/5"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "trends",
      name: "Trend Detection",
      icon: "📈",
      title: "Instant Trend Spike Alerts",
      description: "Detect sudden surges in negative sentiment or feature requests before they impact retention.",
      previewContent: (
        <div className="p-6 flex items-center justify-between bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">⚠️ Anomaly Detected</div>
            <div className="text-sm font-semibold text-white mt-1">Spike in Checkout Latency reports</div>
            <div className="text-xs text-slate-400 mt-1">+340% increase compared to last Tuesday</div>
          </div>
          <button onClick={() => router.push("/login")} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Inspect</button>
        </div>
      ),
    },
    {
      id: "reports",
      name: "VoC Reports",
      icon: "📑",
      title: "Executive Summary Reports",
      description: "Generate boardroom-ready Voice of Customer PDF and CSV reports in one click.",
      previewContent: (
        <div className="p-6 flex items-center justify-between bg-slate-950 rounded-xl border border-slate-800">
          <div>
            <div className="text-xs text-slate-400">Monthly Synthesis Report Q2</div>
            <div className="text-sm font-bold text-white mt-1">Ready for download & stakeholder sync</div>
          </div>
          <button onClick={() => alert("Report downloaded successfully!")} className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer">Download PDF</button>
        </div>
      ),
    },
  ];

  // Auto-rotate tabs every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % workspaceTabs.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [workspaceTabs.length]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white scroll-smooth">
      
      {/* Navbar */}
      <header className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            ∞
          </div>
          <span className="text-2xl font-black tracking-wider text-white">LOOP</span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#engine" className="hover:text-white transition">AI Engine</a>
          <a href="#analytics" className="hover:text-white transition">Analytics</a>
          <a href="#benefits" className="hover:text-white transition">Benefits</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>

        {/* Right Corner: Profile Avatar with Dropdown Menu */}
        <div className="flex items-center gap-4 relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-1.5 rounded-full hover:bg-slate-900 border border-slate-800 transition cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              NB
            </div>
          </button>

          {/* Profile Dropdown Popover */}
          {isProfileOpen && (
            <div className="absolute right-0 top-14 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Header Info */}
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
                  ∞
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-bold text-white truncate">Nishita Bagekar</div>
                  <div className="text-xs text-slate-400 truncate">admin@loop.com</div>
                </div>
              </div>

              {/* Workspace & Details */}
              <div className="py-4 space-y-3 text-xs border-b border-slate-800">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>📖</span> Workspace:
                  </span>
                  <span className="font-bold text-white">LOOP Enterprise</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>🛡️</span> Role:
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-[10px]">ADMIN</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-2 text-slate-400">
                    <span>📅</span> Joined:
                  </span>
                  <span className="font-semibold text-slate-200">August 5, 2026</span>
                </div>
              </div>

              {/* Sign Out Option */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push("/login");
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <span>🚪</span> Sign Out
                  </span>
                  <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center">
        
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          Next-Gen Customer Feedback Intelligence
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Explore the <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">LOOP Workspace</span>
        </h1>

        <p className="text-sm md:text-base text-slate-400 mt-4 max-w-xl mx-auto">
          Unify scattered customer comments into visual metrics. Select any tab below to inspect the interface (rotates automatically).
        </p>

        {/* Interactive Workspace Feature Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {workspaceTabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                activeTab === idx
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30 scale-105"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Interface Preview Box */}
        <div className="mt-8 bg-slate-900/90 backdrop-blur-2xl rounded-3xl border border-slate-800 shadow-2xl overflow-hidden text-left max-w-4xl mx-auto transition-all">
          <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
              <span className="text-xs text-slate-500 ml-3 font-mono">app.loop.ai/{workspaceTabs[activeTab].id}</span>
            </div>
            <div className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
              @AUTO ROTATING
            </div>
          </div>

          <div className="px-6 pt-6">
            <h3 className="text-lg font-extrabold text-white">{workspaceTabs[activeTab].title}</h3>
            <p className="text-xs text-slate-400 mt-1">{workspaceTabs[activeTab].description}</p>
          </div>

          <div className="p-2">
            {workspaceTabs[activeTab].previewContent}
          </div>

          <div className="p-4 bg-slate-950/50 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500">Want full access to this module?</span>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition cursor-pointer"
            >
              Open Dashboard →
            </button>
          </div>
        </div>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Capabilities</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">Powerful Features Built for Product Teams</h2>
          <p className="text-sm text-slate-400 mt-2">Everything you need to capture, synthesize, and action user feedback at scale.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-lg mb-4">📥</div>
            <h3 className="text-lg font-bold text-white mb-2">Omnichannel Ingestion</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Connect App Store reviews, Twitter mentions, support tickets, and direct CSV bulk uploads in seconds.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg mb-4">🏷️</div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Auto-Clustering</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Let machine learning automatically group unstructured text comments into specific feature themes and UI buckets.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-lg mb-4">⚡</div>
            <h3 className="text-lg font-bold text-white mb-2">Actionable Backlog</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Convert raw negative feedback straight into engineering sprint tickets with priority scoring.</p>
          </div>
        </div>
      </section>

      {/* AI ENGINE SECTION */}
      <section id="engine" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Advanced LLM</span>
            <h2 className="text-3xl font-extrabold text-white mt-4">Ask LOOP AI Anything About Your Users</h2>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">Stop digging through spreadsheets. Query your indexed customer feedback database using conversational prompts to get immediate synthesis, quote references, and root cause analysis.</p>
            <ul className="mt-6 space-y-3 text-xs text-slate-300">
              <li className="flex items-center gap-2">✓ Instant root-cause identification on churn spikes</li>
              <li className="flex items-center gap-2">✓ Automated sentiment grading with 99.4% accuracy</li>
              <li className="flex items-center gap-2">✓ Natural language search across thousands of reviews</li>
            </ul>
          </div>
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="text-purple-400 font-bold">Prompt: </span> Why are users complaining about onboarding this week?
            </div>
            <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
              <span className="font-bold text-purple-400 block mb-1">LOOP AI Synthesis:</span> 42 users experienced email verification link timeout during step 2 of signup. Recommendation: Extend token expiration window from 15 mins to 2 hours.
            </div>
          </div>
        </div>
      </section>

      {/* ANALYTICS SECTION */}
      <section id="analytics" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Data Visualization</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">Executive Dashboards & Metrics</h2>
          <p className="text-sm text-slate-400 mt-2">Get full visibility into customer satisfaction trends with interactive charts.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-white mb-1">Sentiment Distribution</h3>
            <p className="text-xs text-slate-400 mb-6">Real-time breakdown of positive, neutral, and negative inputs.</p>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-emerald-400 font-semibold">Positive</span><span>64%</span></div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[64%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-amber-400 font-semibold">Neutral</span><span>24%</span></div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[24%]"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-red-400 font-semibold">Negative</span><span>12%</span></div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden"><div className="bg-red-500 h-full w-[12%]"></div></div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Cross-Channel Volume</h3>
              <p className="text-xs text-slate-400 mb-4">Feedback accumulation velocity across connected platforms.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-slate-300">App Store Reviews</span><span className="font-bold text-blue-400">450 items</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Twitter / X Mentions</span><span className="font-bold text-blue-400">620 items</span></div>
              <div className="flex justify-between"><span className="text-slate-300">Direct CSV Uploads</span><span className="font-bold text-blue-400">412 items</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section id="benefits" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">Why Choose LOOP</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">Built to Accelerate Product Growth</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl font-black text-blue-400 mb-2">10x</div>
            <h3 className="text-sm font-bold text-white mb-1">Faster Synthesis</h3>
            <p className="text-xs text-slate-400">Process weekly customer feedback in minutes instead of manual spreadsheets.</p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl font-black text-emerald-400 mb-2">99.4%</div>
            <h3 className="text-sm font-bold text-white mb-1">Classification Accuracy</h3>
            <p className="text-xs text-slate-400">Advanced sentiment models trained specifically on SaaS and consumer tech reviews.</p>
          </div>
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
            <div className="text-3xl font-black text-indigo-400 mb-2">Zero</div>
            <h3 className="text-sm font-bold text-white mb-1">Missed Insights</h3>
            <p className="text-xs text-slate-400">Catch anomalous trend spikes before churn impacts your bottom line.</p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">Transparent Plans</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">Simple, Predictable Pricing</h2>
          <p className="text-sm text-slate-400 mt-2">Choose the right tier for your product team size.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Starter</h3>
              <p className="text-xs text-slate-400 mb-4">For early-stage startups and indie founders.</p>
              <div className="text-3xl font-black text-white mb-6">$29<span className="text-xs text-slate-400 font-normal">/month</span></div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ Up to 5,000 feedbacks/mo</li>
                <li>✓ Basic sentiment tracking</li>
                <li>✓ CSV Bulk Upload</li>
                <li>✓ 1 Workspace seat</li>
              </ul>
            </div>
            <button onClick={() => router.push("/login")} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer">Get Started</button>
          </div>

          <div className="bg-gradient-to-b from-blue-900/40 to-slate-900/80 p-8 rounded-3xl border border-blue-500/50 flex flex-col justify-between relative shadow-xl shadow-blue-600/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">Most Popular</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Pro Growth</h3>
              <p className="text-xs text-slate-400 mb-4">For scaling product and engineering squads.</p>
              <div className="text-3xl font-black text-white mb-6">$79<span className="text-xs text-slate-400 font-normal">/month</span></div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ Unlimited feedback volume</li>
                <li>✓ Ask LOOP AI Assistant</li>
                <li>✓ Theme Clustering & Trends</li>
                <li>✓ Up to 5 team seats (Admin/Analyst)</li>
              </ul>
            </div>
            <button onClick={() => router.push("/login")} className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition cursor-pointer">Start Pro Trial</button>
          </div>

          <div className="bg-slate-900/60 p-8 rounded-3xl border border-slate-800 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Enterprise</h3>
              <p className="text-xs text-slate-400 mb-4">For large organizations with custom security.</p>
              <div className="text-3xl font-black text-white mb-6">Custom</div>
              <ul className="space-y-3 text-xs text-slate-300 mb-8">
                <li>✓ Dedicated LLM instances</li>
                <li>✓ Custom CRM & Jira integrations</li>
                <li>✓ SAML / SSO Authentication</li>
                <li>✓ Dedicated customer success manager</li>
              </ul>
            </div>
            <button onClick={() => router.push("/login")} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-900">
        <div className="text-center mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white mt-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4 text-xs">
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-white mb-1">How does LOOP import customer feedback?</h3>
            <p className="text-slate-400 leading-relaxed">You can upload standard CSV files via our Bulk Upload widget, or connect directly through our API and upcoming App Store integrations.</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-white mb-1">Can I set custom user roles?</h3>
            <p className="text-slate-400 leading-relaxed">Yes! LOOP supports role-based access control including ADMIN, ANALYST, and VIEWER profiles. You can test admin privileges by logging in with `admin@loop.com`.</p>
          </div>
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-white mb-1">Is my customer data secure?</h3>
            <p className="text-slate-400 leading-relaxed">All feedback data stored locally or synced is encrypted using industry-standard protocols, ensuring full privacy compliance.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 LOOP AI Technologies Inc. All rights reserved.</p>
      </footer>

    </div>
  );
}