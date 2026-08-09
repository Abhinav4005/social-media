import React from "react";
import Navbar from "./Navbar";
import { Users, HeartHandshake, ShieldAlert, UserCheck, EyeOff, Flag, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function GuidelinesPage() {
  const rules = [
    {
      icon: <HeartHandshake className="h-6 w-6 text-rose-500 dark:text-rose-400" />,
      title: "1. Be Respectful & Kind",
      description: "Treat fellow community members with courtesy and respect. Disagreements happen, but personal attacks, threats, and harassment are strictly prohibited.",
    },
    {
      icon: <ShieldAlert className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      title: "2. Zero Tolerance for Hate Speech",
      description: "We do not tolerate content that promotes violence, discrimination, or hatred based on race, ethnicity, religion, gender, sexual orientation, disability, or nationality.",
    },
    {
      icon: <UserCheck className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />,
      title: "3. Authentic Identity & No Spam",
      description: "Use your authentic identity. Impersonating public figures, creating fake accounts, or engaging in automated spam activities will result in immediate suspension.",
    },
    {
      icon: <EyeOff className="h-6 w-6 text-amber-500 dark:text-amber-400" />,
      title: "4. Respect Personal Privacy",
      description: "Never share another person's private information (doxxing), phone numbers, or confidential documents without explicit consent.",
    },
    {
      icon: <Flag className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      title: "5. Safe Media & Content Standards",
      description: "Ensure uploaded photos, videos, and links adhere to community safety standards. Explicit or illegal content is prohibited.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-12">
        <section className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-100 dark:border-rose-900/50 text-xs font-bold text-rose-600 dark:text-rose-400"
          >
            <Users className="h-4 w-4" />
            <span>Community Standards</span>
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Community Guidelines
          </h1>

          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
            These guidelines explain what is and isn't allowed on Connecta to keep our platform welcoming, safe, and positive for everyone.
          </p>
        </section>

        <div className="space-y-6">
          {rules.map((rule, i) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                  {rule.icon}
                </div>
                <h3 className="text-lg font-bold">{rule.title}</h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed pl-13">
                {rule.description}
              </p>
            </motion.div>
          ))}
        </div>

        <section className="p-8 rounded-3xl bg-indigo-50/60 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 space-y-3">
          <h3 className="font-bold text-base text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Enforcement & Reporting
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            If you encounter content or behavior that violates these guidelines, use the post or user menu to report it immediately. Our moderation team reviews reports promptly to maintain community safety.
          </p>
        </section>
      </main>
    </div>
  );
}
