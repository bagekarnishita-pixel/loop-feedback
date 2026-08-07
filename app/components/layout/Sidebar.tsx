"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  // LocalStorage ya default se user role fetch karna ("ADMIN" ya "VIEWER")
  const userRole = typeof window !== "undefined" ? localStorage.getItem("userRole") || "ADMIN" : "ADMIN";

  const navItems = [
    { name: "Analytics", href: "/dashboard", icon: "📊", adminOnly: false },
    { name: "Feedback Inbox", href: "/dashboard/inbox", icon: "📥", adminOnly: false },
    { name: "Theme Clustering", href: "/dashboard/clusters", icon: "🔮", adminOnly: false },
    { name: "AI Simulator", href: "/dashboard/simulator", icon: "✨", adminOnly: true }, // Sirf Admin ke liye
    { name: "VoC Reports", href: "/dashboard/reports", icon: "📈", adminOnly: false },
    { name: "Team Directory", href: "/dashboard/team", icon: "👥", adminOnly: false },
    { name: "Ask LOOP", href: "/dashboard/ask", icon: "🤖", adminOnly: false },
    { name: "Settings", href: "/dashboard/settings", icon: "⚙️", adminOnly: true },    // Sirf Admin ke liye
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
      <div>
        <div className="text-xl font-extrabold tracking-tight text-white mb-8 px-2 bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
          LOOP Feedback
        </div>
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            // Agar item adminOnly hai aur user ADMIN nahi hai, toh use sidebar se hide kar do
            if (item.adminOnly && userRole !== "ADMIN") return null;

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 px-2 flex justify-between items-center">
        <span>Workspace v2.4</span>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20 font-bold uppercase">
          {userRole}
        </span>
      </div>
    </aside>
  );
}