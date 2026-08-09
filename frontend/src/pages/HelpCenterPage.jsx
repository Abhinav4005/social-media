import React, { useState } from "react";
import Navbar from "./Navbar";
import { Search, HelpCircle, Shield, User, MessageSquare, Store, Bell, ChevronRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    {
      icon: <User className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Account & Profile",
      description: "Managing credentials, profile updates, and account recovery.",
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "Privacy & Security",
      description: "Two-factor authentication, block list, and privacy controls.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: "Chat & Video Calls",
      description: "Troubleshooting direct messages, group chats, and WebRTC calls.",
    },
    {
      icon: <Store className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      title: "Marketplace & Sell",
      description: "Listing items, buyer safety tips, and location radius search.",
    },
    {
      icon: <Bell className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Notifications & Feed",
      description: "Managing activity alerts, push notifications, and feed preferences.",
    },
    {
      icon: <HelpCircle className="h-6 w-6 text-rose-500 dark:text-rose-400" />,
      title: "General Inquiries",
      description: "Platform guidelines, system status, and general FAQs.",
    },
  ];

  const faqs = [
    {
      q: "How do I toggle Dark Mode?",
      a: "Click the Sun/Moon icon in the top navigation bar or switch theme under Settings -> App Preferences.",
    },
    {
      q: "How do I block or unblock a user?",
      a: "Go to the user's profile page or chat header menu and select 'Block User'. You can manage blocked users in Privacy Settings.",
    },
    {
      q: "Are video calls encrypted?",
      a: "Yes, WebRTC 1-on-1 audio and video calls use secure peer-to-peer connection protocols.",
    },
    {
      q: "How long do stories remain visible?",
      a: "Stories stay visible to your followers for 24 hours before automatically expiring.",
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold text-indigo-600 dark:text-indigo-400"
          >
            <HelpCircle className="h-4 w-4" />
            <span>Connecta Support</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            How can we help you today?
          </h1>

          <div className="relative max-w-xl mx-auto">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 shadow-md">
              <Search className="h-5 w-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search help articles, FAQs, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-400"
              />
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-2xl font-black text-center tracking-tight">Browse Help Topics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-base flex items-center justify-between">
                  {cat.title}
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  {cat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl font-black tracking-tight text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-2"
              >
                <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">{faq.q}</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-bold">Still need help?</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Our support team is available 24/7 to assist you with any questions.
            </p>
          </div>
          <a
            href="mailto:support@connecta.com"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </a>
        </section>
      </main>
    </div>
  );
}
