"use client";

import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react";

export default function NotificationBell() {
  const [hasNew, setHasNew] = useState(true); // Default true for visual impact
  const [isOpen, setIsOpen] = useState(false);

  // Simulating a new notification arriving after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setHasNew(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setHasNew(false);
        }}
        className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all"
      >
        <Bell className="w-5 h-5 text-slate-400" />
        {hasNew && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        )}
        {hasNew && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-4 z-50">
          <h4 className="text-sm font-bold text-white mb-3">Recent Activity</h4>
          <div className="space-y-3">
            <div className="text-xs text-slate-400 border-l-2 border-indigo-500 pl-3">
              <p className="text-white font-medium">New Feedback Received</p>
              <p>User reported a UI glitch in settings.</p>
            </div>
            <div className="text-xs text-slate-400 border-l-2 border-emerald-500 pl-3">
              <p className="text-white font-medium">Team Update</p>
              <p>Rahul accepted the workspace invite.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
