import React from "react";
import Navbar from "./Navbar";
import { Users, Shield, Zap, Heart, Globe, Award, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const stats = [
    { label: "Active Members", value: "50K+" },
    { label: "Communities & Groups", value: "1,200+" },
    { label: "Daily Messages", value: "2M+" },
    { label: "Uptime & Reliability", value: "99.9%" },
  ];

  const values = [
    {
      icon: <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Community First",
      description: "We build features that empower people to foster genuine connections, meaningful conversations, and thriving communities.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Privacy & Security",
      description: "Your data belongs to you. We enforce strict encryption, privacy controls, and security standards to keep your information safe.",
    },
    {
      icon: <Zap className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Lightning Fast",
      description: "Real-time messaging, instant video calls, and seamless media streaming designed for modern web performance.",
    },
    {
      icon: <Heart className="h-6 w-6 text-rose-500 dark:text-rose-400" />,
      title: "Inclusive & Welcoming",
      description: "A digital space crafted for everyone, respecting diverse perspectives and encouraging healthy online interactions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-20">
        {/* ── Hero Section ── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold text-indigo-600 dark:text-indigo-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>About Connecta</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Connecting People,{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Sharing Stories.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            Connecta is a modern social platform designed to bring friends, creators, and communities closer together through real-time chat, HD video calling, stories, marketplace, and events.
          </p>
        </section>

        {/* ── Stats Grid ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 text-center shadow-xs"
            >
              <p className="font-heading text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ── Values Grid ── */}
        <section className="space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Our Core Values</h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The foundational principles that guide how we design and build Connecta.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4 hover:shadow-md transition-all"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to be part of the community?
          </h2>
          <p className="text-indigo-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Create your account today and experience a platform built for authentic connection and rich interaction.
          </p>
          <div className="pt-2">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-600 font-bold rounded-2xl shadow-md hover:bg-indigo-50 transition-all cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
