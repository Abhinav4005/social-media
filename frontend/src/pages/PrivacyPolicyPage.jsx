import React from "react";
import Navbar from "./Navbar";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      id: "collection",
      title: "1. Information We Collect",
      content: [
        "Account Information: Name, email address, profile photo, and security credentials created upon registration.",
        "User Content: Posts, photos, stories, comments, messages, and marketplace listings created on the platform.",
        "Technical & Device Data: IP address, browser type, device information, and presence status indicators.",
      ],
    },
    {
      id: "usage",
      title: "2. How We Use Your Information",
      content: [
        "To deliver real-time social networking services, instant messaging, and WebRTC video calling.",
        "To customize your feed, recommend relevant communities, groups, events, and marketplace listings.",
        "To enforce platform safety, detect suspicious activity, and prevent unauthorized access or spam.",
      ],
    },
    {
      id: "sharing",
      title: "3. Sharing & Disclosure",
      content: [
        "Public Information: Content shared on public profiles, public groups, or public posts is accessible to community members.",
        "Private Direct Messages: Direct messages and private group conversations are restricted to authorized conversation members.",
        "Third-Party Disclosure: We do not sell, rent, or trade user personal information to third-party advertisers.",
      ],
    },
    {
      id: "security",
      title: "4. Data Security & Storage",
      content: [
        "We implement industry-standard encryption protocols (TLS/SSL) for data in transit and secure database storage for data at rest.",
        "Authentication tokens and passwords are salted and hashed using modern cryptographic algorithms.",
      ],
    },
    {
      id: "rights",
      title: "5. Your Rights & Choices",
      content: [
        "Access & Export: You can request access to or export copies of your account data through Privacy Settings.",
        "Account Deletion: You may modify, update, or permanently delete your account and associated content at any time.",
      ],
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
            <span>Legal & Privacy</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-xs font-bold text-gray-400 dark:text-gray-400 uppercase tracking-wider">
            Last Updated: August 1, 2026
          </p>
        </section>

        {/* ── Overview Box ── */}
        <div className="p-6 rounded-3xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-2">
          <h3 className="font-bold text-base text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <Lock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Our Privacy Commitment
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            At Connecta, we prioritize the protection and security of your personal data. This Privacy Policy outlines what information we collect, how it is used, and the control you have over your data.
          </p>
        </div>

        {/* ── Policy Sections ── */}
        <div className="space-y-8">
          {sections.map((section) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-4"
            >
              <h2 className="text-xl font-bold">{section.title}</h2>
              <ul className="space-y-2.5">
                {section.content.map((point, index) => (
                  <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>
      </main>
    </div>
  );
}
