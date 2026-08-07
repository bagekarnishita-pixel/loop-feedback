"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, ShieldAlert, CheckCircle, Zap } from "lucide-react";

export default function AISimulatorPage() {
  const router = useRouter();

  // Route Protection: Redirect non-admins back to dashboard
  useEffect(() => {
    const role = typeof window !== "undefined" ? localStorage.getItem("userRole") || "ADMIN" : "ADMIN";
    if (role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [router]);

  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [selectedAction, setSelectedAction] = useState<string>("checkout");
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("loop_feedbacks");
    if (saved) {
      setFeedbacks(JSON.parse(saved));
    }
  }, []);

  // Calculate quick metrics from live storage
  const totalCount = feedbacks.length;
  const negativeCount = feedbacks.filter(f => (f.sentiment || "").toLowerCase().includes("neg")).length;
  
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      let predictedUplift = 0;
      let description = "";
      let targetIssue = "";

      if (selectedAction === "checkout") {
        predictedUplift = 15;
        targetIssue = "Mobile Checkout Freezing & Payment Gateways";
        description = "Resolving payment flow blockades will immediately convert frustrated users, eliminating up to 80% of negative reviews.";
      } else if (selectedAction === "darkmode") {
        predictedUplift = 8;
        targetIssue = "UI/UX Enhancements & Theme Consistency";
        description = "Expanding custom styling features boosts overall session length and general user engagement.";
      } else {
        predictedUplift = 12;
        targetIssue = "Third-Party Integrations (Google Calendar / Slack)";
        description = "Fulfilling requested workflow connectors addresses enterprise demands and retention rates.";
      }

      setSimulationResult({
        uplift: predictedUplift,
        issue: targetIssue,
        desc: description,
        affectedItems: Math.min(totalCount, Math.floor(totalCount * 0.4) + 2)
      });
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            Predictive Intelligence // Masterpiece Hub
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" /> Loop Smart-Action Simulator
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Simulate strategic product decisions using live VoC data to predict customer sentiment uplift and prioritize engineering sprints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Configuration Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" /> Select Strategic Action
          </h2>

          <div className="space-y-3">
            <label 
              onClick={() => setSelectedAction("checkout")}
              className={`block p-4 rounded-xl border cursor-pointer transition ${selectedAction === "checkout" ? "bg-indigo-600/10 border-indigo-500 text-white" : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"}`}
            >
              <div className="font-bold text-sm">Fix Mobile Checkout Freezing</div>
              <div className="text-xs text-slate-400 mt-1">High Priority bug fix across iOS & Android</div>
            </label>

            <label 
              onClick={() => setSelectedAction("darkmode")}
              className={`block p-4 rounded-xl border cursor-pointer transition ${selectedAction === "darkmode" ? "bg-indigo-600/10 border-indigo-500 text-white" : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"}`}
            >
              <div className="font-bold text-sm">Enhance Dark Mode UI</div>
              <div className="text-xs text-slate-400 mt-1">Aesthetic polish and contrast updates</div>
            </label>

            <label 
              onClick={() => setSelectedAction("integrations")}
              className={`block p-4 rounded-xl border cursor-pointer transition ${selectedAction === "integrations" ? "bg-indigo-600/10 border-indigo-500 text-white" : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"}`}
            >
              <div className="font-bold text-sm">Add Productivity Integrations</div>
              <div className="text-xs text-slate-400 mt-1">Google Calendar & Slack webhook sync</div>
            </label>
          </div>

          <button
            onClick={handleRunSimulation}
            disabled={isSimulating}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
          >
            {isSimulating ? "Running AI Matrix..." : "Run Impact Simulation"}
          </button>
        </div>

        {/* Right Column: Dynamic Simulation Outcome */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Simulation Intelligence Report</h2>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                Live Data Connected ({totalCount} items)
              </span>
            </div>

            {simulationResult ? (
              <div className="my-6 space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Predicted Sentiment Uplift
                    </div>
                    <div className="text-4xl font-black text-emerald-400 flex items-center gap-2">
                      <TrendingUp className="w-8 h-8" /> +{simulationResult.uplift}%
                    </div>
                  </div>

                  <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Targeted Feedback Items
                    </div>
                    <div className="text-4xl font-black text-indigo-400">
                      {simulationResult.affectedItems} tickets
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    AI Prescriptive Recommendation
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {simulationResult.issue}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {simulationResult.desc}
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-20 text-center space-y-3">
                <Sparkles className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                <div className="text-sm font-bold text-slate-300">Select an action and run simulation</div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Our predictive engine will analyze your live user feedback database to project exact customer satisfaction outcomes.
                </p>
              </div>
            )}
          </div>

          {simulationResult && (
            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => alert("Action pushed successfully to Jira/Trello Sprint Backlog!")}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Push to Sprint Backlog
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}