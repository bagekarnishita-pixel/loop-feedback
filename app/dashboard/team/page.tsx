"use client";

import React, { useState, useEffect } from "react";
import { UserPlus, Users, Trash2, Mail, Shield, CheckCircle2 } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  lastActive: string;
}

const defaultTeam: TeamMember[] = [
  {
    id: 1,
    name: "Nishita Bagekar",
    email: "nishita@gmail.com",
    role: "ADMIN",
    status: "Active",
    joined: "Aug 5, 2026",
    lastActive: "Just now",
  },
  {
    id: 2,
    name: "Rahul Sharma",
    email: "rahul.analyst@gmail.com",
    role: "ANALYST",
    status: "Active",
    joined: "Aug 6, 2026",
    lastActive: "2h ago",
  },
];

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>(defaultTeam);
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [roleInput, setRoleInput] = useState("VIEWER");
  const [copiedLink, setCopiedLink] = useState(false);

  // Load team from localStorage on mount
  useEffect(() => {
    const savedTeam = localStorage.getItem("loop_team_members");
    if (savedTeam) {
      try {
        const parsed = JSON.parse(savedTeam);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeam(parsed);
        }
      } catch (e) {
        console.error("Error loading team members", e);
      }
    }
  }, []);

  const saveTeamState = (newTeam: TeamMember[]) => {
    setTeam(newTeam);
    localStorage.setItem("loop_team_members", JSON.stringify(newTeam));
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim()) return;

    const newMember: TeamMember = {
      id: Date.now(),
      name: nameInput,
      email: emailInput,
      role: roleInput,
      status: "Active",
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      lastActive: "Pending Invite",
    };

    const updatedTeam = [newMember, ...team];
    saveTeamState(updatedTeam);
    setNameInput("");
    setEmailInput("");
    alert(`Invitation sent successfully to ${emailInput}!`);
  };

  const handleRoleChange = (id: number, newRole: string) => {
    const updatedTeam = team.map((member) => (member.id === id ? { ...member, role: newRole } : member));
    saveTeamState(updatedTeam);
  };

  const handleDeleteMember = (id: number) => {
    const updatedTeam = team.filter((member) => member.id !== id);
    saveTeamState(updatedTeam);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText("https://loop-feedback-app.vercel.app/invite?token=secure_workspace_key_99");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" /> Team Directory
        </h1>
        <p className="text-xs text-slate-400 mt-1">Configure teammate roles and workspace accessibility permissions according to your dark theme.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Box: Invite Form */}
        <div className="bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-800 shadow-xl h-fit">
          <div className="flex items-center gap-2 mb-4 text-white font-semibold text-sm">
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>INVITE TEAM MEMBER</span>
          </div>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Teammate Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email Address (Gmail)</label>
              <input
                type="email"
                placeholder="sarah.jenkins@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-600 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Assign Access Role</label>
              <select
                value={roleInput}
                onChange={(e) => setRoleInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
              >
                <option value="VIEWER">VIEWER (Read-only)</option>
                <option value="ANALYST">ANALYST (Manage Feedback)</option>
                <option value="ADMIN">ADMIN (Full Access)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg text-sm shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Mail className="w-4 h-4" /> Send Workspace Invite
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 mb-2">Or share a direct invite link:</p>
            <button
              onClick={handleCopyInviteLink}
              className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Shield className="w-4 h-4 text-blue-400" />}
              {copiedLink ? "Invite Link Copied!" : "Copy Invite URL Link"}
            </button>
          </div>
        </div>

        {/* Right Box: Member List Table */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>WORKSPACE MEMBER LIST</span>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700">
              Total: {team.length} Members
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 bg-slate-950/50 uppercase tracking-wider">
                  <th className="p-4">Member</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Last Active</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
                {team.length > 0 ? (
                  team.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-inner">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              {member.name}
                              {member.id === 1 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">You</span>}
                            </div>
                            <div className="text-xs text-slate-400">{member.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="bg-slate-950 text-slate-300 border border-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="ANALYST">ANALYST</option>
                          <option value="VIEWER">VIEWER</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {member.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-400">{member.joined}</td>
                      <td className="p-4 text-xs text-slate-400">{member.lastActive}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          title="Remove member"
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/20 transition-colors cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No team members found. Invite someone using the form on the left.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}