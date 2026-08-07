"use client";

import React, { useState, useEffect } from "react";
import { Search, Trash2, User } from "lucide-react";

interface FeedbackItem {
  id: number;
  text: string;
  channel: string;
  sentiment: string;
  status: string;
  assignee?: string;
}

const teamMembers = ["Unassigned", "Nishita Bagekar", "Rahul Sharma", "Priya Verma", "Amit Patel"];

export default function InboxPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("All Channels");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userRole, setUserRole] = useState("Admin"); // Default to Admin

  const [newText, setNewText] = useState("");
  const [newChannel, setNewChannel] = useState("App Store");
  const [newSentiment, setNewSentiment] = useState("Neutral");
  const [isRecording, setIsRecording] = useState(false);

  // Feedback list state with localStorage sync
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([
    { id: 1, text: "The app crashes when I click checkout on mobile.", channel: "App Store", sentiment: "Negative", status: "NEW", assignee: "Unassigned" },
    { id: 2, text: "Love the new dark mode feature, super clean!", channel: "Twitter", sentiment: "Positive", status: "REVIEWED", assignee: "Unassigned" },
    { id: 3, text: "Please add integration with Google Calendar.", channel: "Email", sentiment: "Neutral", status: "ACTIONED", assignee: "Unassigned" },
  ]);

  // Page load par localStorage se data fetch karna
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      localStorage.setItem("userRole", "Admin");
      setUserRole("Admin");
    }
    
    const savedFeedbacks = localStorage.getItem("loop_feedbacks");
    if (savedFeedbacks) {
      try {
        const parsed = JSON.parse(savedFeedbacks);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const formatted = parsed.map((item, index) => {
            let textVal = item.text || item.feedback || item.content || (typeof item === "string" ? item : "Imported Feedback");
            let channelVal = item.channel || item.source || "App Store";
            let sentimentVal = item.sentiment || item.tone || "Neutral";

            const sentimentList = ["POSITIVE", "NEGATIVE", "NEUTRAL", "Positive", "Negative", "Neutral"];
            if (sentimentList.includes(channelVal) && !sentimentList.includes(sentimentVal)) {
              const temp = channelVal;
              channelVal = sentimentVal;
              sentimentVal = temp;
            }

            return {
              id: item.id || Date.now() + index,
              text: textVal,
              channel: channelVal,
              sentiment: sentimentVal,
              status: item.status || "NEW",
              assignee: item.assignee || "Unassigned",
            };
          });
          setFeedbacks(formatted);
        }
      } catch (e) {
        console.error("Error loading saved feedbacks", e);
      }
    }
  }, []);

  const handleRoleChange = (newRole: string) => {
    setUserRole(newRole);
    localStorage.setItem("userRole", newRole);
    window.dispatchEvent(new Event("local-storage-update"));
  };

  const updateFeedbacksState = (newItems: FeedbackItem[]) => {
    setFeedbacks(newItems);
    localStorage.setItem("loop_feedbacks", JSON.stringify(newItems));
    window.dispatchEvent(new Event("local-storage-update"));
    window.dispatchEvent(new StorageEvent("storage", { key: "loop_feedbacks" }));
  };

  const handleVoiceRecord = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsRecording(true);
    recognition.onresult = (event: any) => {
      setNewText((prev) => `${prev} ${event.results[0][0].transcript}`);
      setIsRecording(false);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);
  };

  const handleAddFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === "Viewer") {
      alert("Access Denied: Viewers cannot add new feedback.");
      return;
    }
    if (!newText.trim()) return;

    const newItem: FeedbackItem = {
      id: Date.now(),
      text: newText,
      channel: newChannel,
      sentiment: newSentiment,
      status: "NEW",
      assignee: "Unassigned",
    };

    const updated = [newItem, ...feedbacks];
    updateFeedbacksState(updated);
    setNewText("");
    setIsModalOpen(false);
  };

  const handleStatusToggle = (id: number) => {
    if (userRole === "Viewer") {
      alert("Access Denied: Viewers cannot modify status.");
      return;
    }
    const updated = feedbacks.map(item => {
      if (item.id === id) {
        let nextStatus = "NEW";
        if (item.status === "NEW") nextStatus = "REVIEWED";
        else if (item.status === "REVIEWED") nextStatus = "ACTIONED";
        else if (item.status === "ACTIONED") nextStatus = "NEW";
        return { ...item, status: nextStatus };
      }
      return item;
    });
    updateFeedbacksState(updated);
  };

  const handleAssigneeChange = (id: number, newAssignee: string) => {
    if (userRole === "Viewer") {
      alert("Access Denied: Viewers cannot change assignees.");
      return;
    }
    const updated = feedbacks.map(item => {
      if (item.id === id) {
        return { ...item, assignee: newAssignee };
      }
      return item;
    });
    updateFeedbacksState(updated);
  };

  const handleDeleteFeedback = (id: number) => {
    if (userRole === "Viewer") {
      alert("Access Denied: Viewers cannot delete feedback entries.");
      return;
    }
    const updated = feedbacks.filter(item => item.id !== id);
    updateFeedbacksState(updated);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Feedback Text,Channel,Sentiment,Status,Assignee\n";
    feedbacks.forEach(row => {
      csvContent += `${row.id},"${row.text}",${row.channel},${row.sentiment},${row.status},${row.assignee || "Unassigned"}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "LOOP_Feedback_Export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredFeedbacks = feedbacks.filter((item) => {
    const textVal = item.text || "";
    const matchesSearch = textVal.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesChannel = selectedChannel === "All Channels" || item.channel === selectedChannel;
    const matchesStatus = selectedStatus === "All Statuses" || item.status === selectedStatus;
    return matchesSearch && matchesChannel && matchesStatus;
  });

  // Admin aur Analyst ke paas editing ka full access rahega
  const canEdit = userRole === "Admin" || userRole === "Analyst";

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen bg-slate-950 text-slate-100 transition-colors">
      
      {/* Header & Role Switcher Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Feedback Inbox 
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-normal">
              Role: <strong className="text-white">{userRole}</strong>
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage, filter, and assign multi-channel customer responses to your team.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Switcher Component */}
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Switch Role:</span>
            <select
              value={userRole}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="bg-slate-950 text-xs font-bold text-white px-2 py-1 rounded-lg border border-slate-700 outline-none cursor-pointer"
            >
              <option value="Admin">Admin (Full Access)</option>
              <option value="Analyst">Analyst (Full Access)</option>
              <option value="Viewer">Viewer (Read Only)</option>
            </select>
          </div>

          {userRole !== "Viewer" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              ➕ Add Feedback
            </button>
          )}

          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            📥 Export CSV
          </button>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl p-4 rounded-xl shadow-sm border border-slate-800 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search feedback..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Channels</option>
            <option>App Store</option>
            <option>Twitter</option>
            <option>Email</option>
            <option>Support Ticket</option>
            <option>Web App</option>
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full md:w-auto px-4 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option>All Statuses</option>
            <option>NEW</option>
            <option>REVIEWED</option>
            <option>ACTIONED</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl rounded-xl shadow-sm border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-xs text-slate-400 bg-slate-900">
              <th className="p-4">FEEDBACK TEXT</th>
              <th className="p-4">CHANNEL</th>
              <th className="p-4">SENTIMENT</th>
              <th className="p-4">ASSIGNEE</th>
              <th className="p-4">STATUS / ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
            {filteredFeedbacks.length > 0 ? (
              filteredFeedbacks.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium">{item.text}</td>
                  <td className="p-4 text-slate-400">{item.channel}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      item.sentiment === "Positive" || item.sentiment === "POSITIVE" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
                      item.sentiment === "Negative" || item.sentiment === "NEGATIVE" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
                      "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}>
                      {item.sentiment}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-xs w-fit">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={item.assignee || "Unassigned"}
                        onChange={(e) => handleAssigneeChange(item.id, e.target.value)}
                        disabled={!canEdit}
                        className={`bg-transparent text-slate-300 focus:outline-none ${!canEdit ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {teamMembers.map((member) => (
                          <option key={member} value={member} className="bg-slate-900 text-slate-200">
                            {member}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-2">
                    <button
                      onClick={() => handleStatusToggle(item.id)}
                      disabled={!canEdit}
                      title={canEdit ? "Click to cycle status" : "Viewers cannot modify status"}
                      className={`px-3 py-1 rounded border text-xs font-bold transition-all ${
                        !canEdit ? "opacity-60 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-400" :
                        item.status === "NEW" ? "bg-blue-500/10 border-blue-500/30 text-blue-400 cursor-pointer" :
                        item.status === "REVIEWED" ? "bg-amber-500/10 border-amber-500/30 text-amber-400 cursor-pointer" :
                        "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 cursor-pointer"
                      }`}
                    >
                      {item.status} {canEdit && "🔄"}
                    </button>

                    {userRole !== "Viewer" ? (
                      <button
                        onClick={() => handleDeleteFeedback(item.id)}
                        title="Delete Feedback"
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded border border-red-500/20 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-500 italic px-1" title="Viewers have read-only access">
                        👁️ Read-only
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No matching feedback found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && userRole !== "Viewer" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 w-full max-w-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Add New Feedback</h2>
              <button
                type="button"
                onClick={handleVoiceRecord}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  isRecording ? "bg-red-500/20 text-red-400 border-red-500/40 animate-pulse" : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                🎙️ {isRecording ? "Listening..." : "Voice Input"}
              </button>
            </div>

            <form onSubmit={handleAddFeedback}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-1">Feedback Content</label>
                <textarea
                  rows={3}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Type feedback..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Channel</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>App Store</option>
                    <option>Twitter</option>
                    <option>Email</option>
                    <option>Support Ticket</option>
                    <option>Web App</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Sentiment</label>
                  <select
                    value={newSentiment}
                    onChange={(e) => setNewSentiment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option>Positive</option>
                    <option>Neutral</option>
                    <option>Negative</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  Save Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}