import React from "react";
import Navbar from "./Navbar";
import { FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function TermsPage() {
  const termsSections = [
    {
      title: "1. Acceptance of Terms",
      content:
        "By accessing or using Connecta, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.",
    },
    {
      title: "2. User Accounts & Security",
      content:
        "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use or security breach.",
    },
    {
      title: "3. Acceptable Use & Conduct Guidelines",
      content:
        "You agree not to post, share, or transmit content that is illegal, defamatory, abusive, harassing, hateful, or infringes on intellectual property rights. Spamming, impersonation, and harmful bot activity are strictly prohibited.",
    },
    {
      title: "4. Intellectual Property & Content Rights",
      content:
        "You retain full ownership of the text, photos, videos, and content you publish on Connecta. By posting, you grant Connecta a non-exclusive license to host, display, and distribute your content to deliver the service.",
    },
    {
      title: "5. Termination & Account Suspension",
      content:
        "We reserve the right to suspend or terminate accounts that violate our Community Guidelines or Terms of Service, with or without prior notice.",
    },
    {
      title: "6. Limitation of Liability",
      content:
        "Connecta is provided on an 'as is' and 'as available' basis. We make no warranties regarding uninterrupted access, bug-free operations, or availability of user content.",
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/50 text-xs font-bold text-purple-600 dark:text-purple-400"
          >
            <FileText className="h-4 w-4" />
            <span>Legal Agreement</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Terms of Service
          </h1>

          <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
            Effective Date: August 1, 2026
          </p>
        </section>

        {/* ── Terms Grid ── */}
        <div className="space-y-6">
          {termsSections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3"
            >
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-7">
                {section.content}
              </p>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}
