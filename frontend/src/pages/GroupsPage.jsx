import React, { useState } from "react";
import { Search, Plus, Users, Globe, Lock, Check } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import FeedLayout from "../components/FeedLayout";

const yourGroups = [
  { id: 1, name: "Design Community", type: "Public group", members: "9.1K members", image: "https://images.unsplash.com/photo-1542744094-3a31b272c490?q=80&w=600&auto=format&fit=crop" },
  { id: 2, name: "Travel Lovers", type: "Public group", members: "8.7K members", image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop" },
  { id: 3, name: "Photography Hub", type: "Private group", members: "5.6K members", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop" },
];

const discoverGroups = [
  { id: 4, name: "Creative Mind", type: "Public group", members: "9.1K members", joined: true },
  { id: 5, name: "UI/UX Designers", type: "Public group", members: "15.4K members", joined: false },
  { id: 6, name: "Freelance World", type: "Public group", members: "7.8K members", joined: false },
  { id: 7, name: "Startup Hub", type: "Public group", members: "6.2K members", joined: false },
  { id: 8, name: "Digital Nomads", type: "Public group", members: "18.3K members", joined: false },
];

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [joinedState, setJoinedState] = useState(
    discoverGroups.reduce((acc, g) => ({ ...acc, [g.id]: g.joined }), {})
  );

  const toggleJoin = (id) => {
    setJoinedState((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      <Navbar />
      <FeedLayout
        left={<Sidebar />}
        center={
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">Your groups</h1>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-400">Discover and manage communities you care about</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer">
                <Plus className="w-4 h-4" />
                Create group
              </button>
            </div>

            {/* Featured Cards Carousel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {yourGroups.map((group) => (
                <div key={group.id} className="group relative overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all">
                  <div className="h-28 overflow-hidden relative">
                    <img src={group.image} alt={group.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate">{group.name}</h3>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-400 mt-0.5">{group.members}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tabs & Search */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All groups" },
                  { id: "your", label: "Your groups" },
                  { id: "discover", label: "Discover" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50 shadow-xs"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Group List */}
            <div className="space-y-3">
              {discoverGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs hover:shadow-md transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xs">
                      {group.name[0]}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">{group.name}</h4>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-400">{group.type} • {group.members}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleJoin(group.id)}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      joinedState[group.id]
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                    }`}
                  >
                    {joinedState[group.id] ? "Joined" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </>
  );
}
