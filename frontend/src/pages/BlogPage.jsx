import React from "react";
import Navbar from "./Navbar";
import { Sparkles, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "Introducing HD Audio & Video Calling on Connecta",
      category: "Product Update",
      date: "Jul 28, 2026",
      readTime: "4 min read",
      snippet: "Connect directly with friends through low-latency WebRTC 1-on-1 video calls featuring crystal clear audio and real-time call notifications.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Building Safer Communities & Better Privacy Controls",
      category: "Safety & Privacy",
      date: "Jul 20, 2026",
      readTime: "5 min read",
      snippet: "Discover our latest privacy enhancements including granular block manager tools, mute options, and customizable post visibility.",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "How Dark Mode Improves Readability & Lowers Battery Drain",
      category: "Engineering & Design",
      date: "Jul 15, 2026",
      readTime: "3 min read",
      snippet: "An inside look at our smooth 250ms CSS theme transition engine and color palette tailoring for modern OLED displays.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 4,
      title: "Mastering the Peer-to-Peer Marketplace: Buyer & Seller Tips",
      category: "Community Guide",
      date: "Jul 08, 2026",
      readTime: "6 min read",
      snippet: "Learn how to optimize your local item listings, take great photos, and communicate safely with nearby buyers.",
      image: "https://images.unsplash.com/photo-1556742049-0a67dd016d97?q=80&w=600&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-16">
        {/* ── Header ── */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50 text-xs font-bold text-indigo-600 dark:text-indigo-400"
          >
            <BookOpen className="h-4 w-4" />
            <span>Connecta Blog</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Latest News & Product Stories
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
            Stay updated with new features, engineering insights, community spotlights, and design updates from the Connecta team.
          </p>
        </section>

        {/* ── Articles Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video w-full overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shadow-xs">
                    {article.category}
                  </span>
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg sm:text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {article.snippet}
                  </p>
                </div>
              </div>
              <div className="px-6 pb-6 pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Read Article
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
