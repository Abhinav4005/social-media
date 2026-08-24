import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Crown, CheckCircle2, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIUpgradeModal({ isOpen, onClose, message }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose?.();
        navigate("/pricing");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 overflow-hidden"
            >
                {/* Decorative Ambient Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full blur-3xl opacity-30 pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-pink-500 to-amber-500 rounded-full blur-3xl opacity-20 pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold p-1 cursor-pointer transition"
                >
                    ✕
                </button>

                {/* Header Icon */}
                <div className="flex flex-col items-center text-center space-y-3 mb-6">
                    <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 ring-4 ring-indigo-50 dark:ring-slate-800">
                        <Crown className="w-8 h-8 animate-bounce" />
                    </div>
                    <span className="px-3 py-1 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> AI Premium Exclusive
                    </span>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 tracking-tight">
                        Unlock Unlimited AI Power
                    </h2>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                        {message || "You have reached your daily free AI limit (3/3 calls). Upgrade to SocialHub Premium for unlimited access."}
                    </p>
                </div>

                {/* Feature Highlights */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 mb-6 border border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span>Unlimited AI Magic Writer for Posts & Captions</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span>24/7 Priority Gemini AI Chat Bot Companion</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-pink-500 flex-shrink-0" />
                        <span>Instant Post Thread Summarizer & Sentiment Analysis</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-800 dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>1-Click AI Smart Reply Suggestions</span>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2.5">
                    <button
                        onClick={handleUpgrade}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-xs rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                        <Zap className="w-4 h-4 fill-white" />
                        <span>Upgrade to Premium</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition cursor-pointer"
                    >
                        Continue with Free Tier
                    </button>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Cancel anytime · Secure checkout</span>
                </div>
            </motion.div>
        </div>
    );
}
