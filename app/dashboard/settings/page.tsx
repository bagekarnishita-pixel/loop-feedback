"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState("Admin");

  // Profile Form States
  const [name, setName] = useState("Nishita Bagekar");
  const [email, setEmail] = useState("admin@loop.com");

  // Workspace Form States
  const [workspace, setWorkspace] = useState("Production LLP");
  const [timezone, setTimezone] = useState("UTC - 5:00 (EST)");
  const [language, setLanguage] = useState("English (US)");

  useEffect(() => {
    setName(localStorage.getItem("userName") || "Nishita Bagekar");
    setEmail(localStorage.getItem("userEmail") || "admin@loop.com");
    setWorkspace(localStorage.getItem("workspaceName") || "Production LLP");
    setTimezone(localStorage.getItem("workspaceTimezone") || "UTC - 5:00 (EST)");
    setLanguage(localStorage.getItem("workspaceLanguage") || "English (US)");
    setUserRole(localStorage.getItem("userRole") || "Admin");
  }, []);

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    localStorage.setItem("userRole", newRole);
    window.dispatchEvent(new Event("local-storage-update"));
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "Admin") {
      alert("Access Denied: Only Administrators can modify profile settings.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("userName", name);
      localStorage.setItem("userEmail", email);
      window.dispatchEvent(new Event("local-storage-update"));
      alert("Profile details saved successfully!");
      setIsLoading(false);
    }, 600);
  };

  const handleWorkspaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole !== "Admin") {
      alert("Access Denied: Only Administrators can modify workspace preferences.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("workspaceName", workspace);
      localStorage.setItem("workspaceTimezone", timezone);
      localStorage.setItem("workspaceLanguage", language);
      window.dispatchEvent(new Event("local-storage-update"));
      alert("Workspace preferences saved successfully!");
      setIsLoading(false);
    }, 600);
  };

  const settingsTabs = [
    { id: "profile", label: "Admin Profile", icon: "👤" },
    { id: "workspace", label: "Workspace Preferences", icon: "⚙️" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-slate-100 font-sans">
      
      {/* Header & Role Switcher Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Settings Configurations
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Alter company preferences, user profile details, and active notifications.
          </p>
        </div>

        {/* Role Switcher Component for Testing */}
        <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-lg">
          <span className="text-xs text-slate-400 font-medium">Active Role:</span>
          <select
            value={userRole}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="bg-slate-950 text-xs font-bold text-white px-3 py-1.5 rounded-xl border border-slate-700 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
          >
            <option value="Admin">Admin (Full Access)</option>
            <option value="Analyst">Analyst (Restricted)</option>
          </select>
        </div>
      </div>

      {/* Analyst Access Restriction Notice */}
      {userRole === "Analyst" ? (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-rose-500/20 p-12 rounded-3xl text-center max-w-2xl mx-auto my-12 shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            🔒
          </div>
          <h2 className="text-xl font-bold text-white">Administrator Access Required</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            You are currently logged in with an <strong className="text-slate-200">Analyst</strong> role. Analysts can review feedback, manage statuses, and generate CSV reports, but system and workspace settings are restricted to Administrators.
          </p>
          <button
            onClick={() => handleRoleChange("Admin")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer mt-2"
          >
            Switch to Admin Role
          </button>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 mb-8">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? "text-white border-blue-500 bg-blue-500/5 rounded-t-lg"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="space-y-8">
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-xl">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                  <span>👤</span> Admin Profile Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Profile Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Gmail Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg transition cursor-pointer flex items-center gap-2"
                  >
                    {isLoading ? "Saving..." : "Save Profile Details"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "workspace" && (
              <form onSubmit={handleWorkspaceSubmit} className="bg-slate-900/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-800/80 shadow-xl">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                  <span>⚙️</span> Workspace Preferences
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="col-span-1 md:col-span-2">
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Company / Workspace Name</label>
                    <input
                      type="text"
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Timezone Profile</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                      <option>UTC - 5:00 (EST)</option>
                      <option>UTC - 6:00 (CST)</option>
                      <option>UTC - 7:00 (MST)</option>
                      <option>UTC + 5:30 (IST)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Preferred Language</label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                    >
                      <option>English (US)</option>
                      <option>English (UK)</option>
                      <option>Hindi (HI)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold shadow-lg transition cursor-pointer"
                  >
                    {isLoading ? "Saving..." : "Save Workspace Preferences"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}