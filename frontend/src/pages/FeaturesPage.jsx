import React from "react";
import Navbar from "./Navbar";
import { MessageSquare, Video, Camera, Users, Store, Calendar, ShieldCheck, Moon, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function FeaturesPage() {
  const featureList = [
    {
      icon: <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Real-Time Messaging & Chat",
      description: "Instant direct messages, group chats, typing indicators, user presence status, and media attachments powered by WebSockets.",
    },
    {
      icon: <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "HD Audio & Video Calling",
      description: "High-definition, low-latency 1-on-1 audio and video calls powered by WebRTC technology with incoming call notifications.",
    },
    {
      icon: <Camera className="h-6 w-6 text-pink-500 dark:text-pink-400" />,
      title: "Interactive Stories",
      description: "Share 24-hour visual stories with your followers using vibrant gradient overlays, caption tags, and interactive circles.",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-500 dark:text-blue-400" />,
      title: "Communities & Groups",
      description: "Discover, create, and manage public or private community groups based on shared interests, topics, and passions.",
    },
    {
      icon: <Store className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      title: "Peer-to-Peer Marketplace",
      description: "Explore local item listings, post items for sale, filter by location radius, and message sellers directly.",
    },
    {
      icon: <Calendar className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "Events & Meetups",
      description: "Browse upcoming local tech conferences, music festivals, and networking events with interactive date badges.",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-teal-500 dark:text-teal-400" />,
      title: "Advanced Privacy Controls",
      description: "Customize who can see your posts, manage blocked lists, mute notifications, and control account visibility.",
    },
    {
      icon: <Moon className="h-6 w-6 text-indigo-500 dark:text-indigo-400" />,
      title: "Dynamic Light & Dark Theme",
      description: "Switch seamlessly between sleek dark mode and vibrant light mode with smooth 250ms color transitions.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        {/* ── Hero Section ── */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold text-indigo-600 dark:text-indigo-400"
          >
            <Sparkles className="h-4 w-4" />
            <span>Platform Capabilities</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight">
            Designed for{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Modern Social Life.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            Discover all the powerful tools and interactive features built right into Connecta to keep you engaged, entertained, and connected.
          </p>
        </section>

        {/* ── Feature Cards Grid ── */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureList.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3 hover:shadow-md transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="font-bold text-base leading-snug">{f.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </section>

        {/* ── Bottom CTA ── */}
        <section className="p-10 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black">Experience Connecta today</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Join thousands of people communicating on a modern, private social network.
            </p>
          </div>
          <Link
            to="/signup"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex-shrink-0"
          >
            Create Account
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </div>
  );
}
