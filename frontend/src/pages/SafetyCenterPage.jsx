import React from "react";
import Navbar from "./Navbar";
import { ShieldCheck, Lock, Eye, BellOff, UserX, AlertTriangle, KeyRound } from "lucide-react";
import { motion } from "framer-motion";

export default function SafetyCenterPage() {
  const safetyTools = [
    {
      icon: <UserX className="h-6 w-6 text-rose-500 dark:text-rose-400" />,
      title: "Block & Mute Controls",
      description: "Instantly block users to prevent them from messaging you or viewing your profile, or mute notifications from specific channels.",
    },
    {
      icon: <Lock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Private Post Visibility",
      description: "Choose who sees your posts—whether shared publicly, restricted to connections, or visible only to customized friend lists.",
    },
    {
      icon: <KeyRound className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      title: "Secure Authentication",
      description: "Protected session management, salted password hashing, and real-time active login session monitoring.",
    },
    {
      icon: <BellOff className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Granular Notification Controls",
      description: "Manage sound alerts, email summaries, and activity badges to prevent unwanted interruptions and maintain focus.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        {/* ── Header ── */}
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 text-xs font-bold text-emerald-600 dark:text-emerald-400"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Safety & Protection</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Safety Center
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            Your safety and digital well-being are fundamental to Connecta. Discover the tools and resources available to protect your experience.
          </p>
        </section>

        {/* ── Safety Tools Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {safetyTools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold">{tool.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Safety Tips Section ── */}
        <section className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Essential Online Safety Tips
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed list-disc pl-5">
            <li>Never share your account password, authentication tokens, or sensitive financial information with anyone.</li>
            <li>Verify user profiles before conducting peer-to-peer marketplace transactions or sharing personal details.</li>
            <li>Report suspicious posts, messages, or accounts using the built-in moderation report buttons.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
