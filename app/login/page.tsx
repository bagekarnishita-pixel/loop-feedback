"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  
  // Toggle between login and register
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    // Official Lists for roles
    const adminEmails = ["admin@loop.com", "boss@loop.com", "nishita@loop.com"]; // Apna email yahan add kar sakti hain
    const analystEmails = ["analyst@loop.com", "rahul.analyst@loop.com"];

    // 1. REGISTER FLOW
    if (authMode === "register") {
      if (!fullName.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      if (!workspaceName.trim()) {
        setError("Workspace or Company Name is required.");
        return;
      }

      const existingUsers = JSON.parse(localStorage.getItem("loop_users") || "[]");
      const userExists = existingUsers.find((u: any) => u.email === cleanEmail);

      if (userExists) {
        setError("An account with this email already exists. Please login.");
        return;
      }

      // Role Assignment Logic
      let assignedRole = "VIEWER";
      if (adminEmails.includes(cleanEmail)) {
        assignedRole = "ADMIN";
      } else if (analystEmails.includes(cleanEmail) || cleanEmail.includes("analyst")) {
        assignedRole = "ANALYST";
      }

      const newUser = {
        fullName,
        email: cleanEmail,
        password,
        workspaceId: workspaceName.trim(),
        role: assignedRole,
      };

      existingUsers.push(newUser);
      localStorage.setItem("loop_users", JSON.stringify(existingUsers));

      setSuccessMsg("Account created successfully! Please log in.");
      setAuthMode("login");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    // 2. LOGIN FLOW
    let assignedRole = "VIEWER";
    let activeWorkspace = workspaceName || "demo-workspace-1";

    if (adminEmails.includes(cleanEmail)) {
      assignedRole = "ADMIN";
      activeWorkspace = workspaceName || "admin-workspace";
    } else if (analystEmails.includes(cleanEmail) || cleanEmail.includes("analyst")) {
      assignedRole = "ANALYST";
      activeWorkspace = workspaceName || "analyst-workspace";
    } else {
      const existingUsers = JSON.parse(localStorage.getItem("loop_users") || "[]");
      const foundUser = existingUsers.find((u: any) => u.email === cleanEmail && u.password === password);

      if (!foundUser) {
        setError("Invalid email, password, or account does not exist.");
        return;
      }

      assignedRole = foundUser.role;
      activeWorkspace = foundUser.workspaceId;
    }

    // Save session to localStorage
    localStorage.setItem("userRole", assignedRole);
    localStorage.setItem("userEmail", cleanEmail);
    localStorage.setItem("workspaceId", activeWorkspace);
    window.dispatchEvent(new Event("storage"));

    router.push("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans px-4 py-8">
      
      {/* Brand Logo Section */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            ∞
          </div>
          <span className="text-2xl font-black tracking-wider text-white">LOOP</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl w-full max-w-xl transition-all">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            {authMode === "register" ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {authMode === "register"
              ? "Join LOOP and start managing feedback smarter."
              : "Login to continue using LOOP Feedback"}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl font-medium">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name (Register Only) */}
          {authMode === "register" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                required={authMode === "register"}
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
              required
            />
          </div>

          {/* Password & Confirm Password */}
          <div className={`grid grid-cols-1 ${authMode === "register" ? "md:grid-cols-2" : "grid-cols-1"} gap-4`}>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={authMode === "register" ? "Create password" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 text-xs"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            {authMode === "register" && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition pr-10"
                    required={authMode === "register"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-200 text-xs"
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Workspace / Company Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {authMode === "register" ? "Workspace / Company Name" : "Workspace ID"}
            </label>
            <input
              type="text"
              placeholder={authMode === "register" ? "Enter workspace or company name" : "demo-workspace-1"}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Login Extras */}
          {authMode === "login" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                <input type="checkbox" className="rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-blue-500" />
                <span>Remember Me</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert("Password reset link simulated."); }} className="text-blue-400 hover:underline font-medium">
                Forgot Password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            {authMode === "register" ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-400">
            {authMode === "register" ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setError("");
                setSuccessMsg("");
              }}
              className="text-blue-400 hover:underline font-bold ml-1 cursor-pointer"
            >
              {authMode === "register" ? "Login" : "Register"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}