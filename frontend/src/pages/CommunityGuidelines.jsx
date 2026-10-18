import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, HeartHandshake, Lock, FileWarning, HelpCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { moderationService } from "../services/moderation.service";

export default function CommunityGuidelines() {
    const [guidelines, setGuidelines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        moderationService.getCommunityGuidelines()
            .then((res) => setGuidelines(res.data || []))
            .catch((err) => console.error("Failed to fetch guidelines:", err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-white py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Navigation & Header */}
                <div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to SocialHub</span>
                    </Link>
                    <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl overflow-hidden">
                        <div className="relative z-10 max-w-xl space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                                <ShieldCheck className="w-4 h-4" />
                                <span>Trust & Safety Standards</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                                SocialHub Community Guidelines
                            </h1>
                            <p className="text-sm text-indigo-100">
                                Our guidelines ensure SocialHub remains a safe, welcoming, and productive environment for everyone.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Policy Guidelines Cards */}
                {loading ? (
                    <div className="text-center py-12 text-gray-400">Loading guidelines...</div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2">
                        {guidelines.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg shadow-gray-200/50 dark:shadow-none space-y-3"
                            >
                                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                    {idx + 1}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                <span className="inline-block px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-slate-800 text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Category: {item.category}
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                    {item.content}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Safety & Enforcement Policy */}
                <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg space-y-4">
                    <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
                        <FileWarning className="w-6 h-6" />
                        <h3 className="text-lg font-bold">Enforcement & Appeals</h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        Violations of these guidelines may result in content removal, feature restrictions (such as post or comment bans), or permanent account termination. If you believe a moderation action was taken in error, you may submit a formal appeal through your account safety settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
