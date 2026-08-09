import React, { useState } from 'react';
import { X, Globe, Users, Lock, Send, Smile, AtSign } from 'lucide-react';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from "framer-motion";

const AUDIENCE_OPTIONS = [
    { id: "public", label: "Public", icon: Globe, desc: "Anyone can see" },
    { id: "friends", label: "Friends", icon: Users, desc: "Your connections" },
    { id: "private", label: "Only me", icon: Lock, desc: "Just you" },
];

const SahreModal = ({ isOpen = true, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const [text, setText] = useState("");
    const [audience, setAudience] = useState("public");
    const [showAudience, setShowAudience] = useState(false);

    const selectedAudience = AUDIENCE_OPTIONS.find(o => o.id === audience);
    const AudienceIcon = selectedAudience?.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100]"
                    />

                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="w-full max-w-[540px] bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl shadow-indigo-500/10 border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100 dark:border-slate-800">
                                <h3 className="font-extrabold text-xl text-gray-900 dark:text-white tracking-tight">
                                    Share Post
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-7 space-y-6 flex-1 overflow-y-auto">
                                {/* Profile Row */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3.5">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-vibrant p-0.5 shadow-md shadow-indigo-500/20">
                                                <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] overflow-hidden flex items-center justify-center">
                                                    {user?.profileImage ? (
                                                        <img src={user.profileImage} alt={user?.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="font-black text-indigo-600 text-lg">
                                                            {user?.name?.charAt(0) || "U"}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-gray-900 dark:text-white text-base leading-tight">
                                                {user?.name || "Anonymous"}
                                            </h4>
                                            <p className="text-xs text-gray-400 font-medium">Post to your feed</p>
                                        </div>
                                    </div>

                                    {/* Audience Pill Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowAudience(!showAudience)}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
                                        >
                                            {AudienceIcon && <AudienceIcon className="w-3.5 h-3.5" />}
                                            <span>{selectedAudience?.label}</span>
                                        </button>

                                        <AnimatePresence>
                                            {showAudience && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95, y: 6 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95, y: 6 }}
                                                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-1.5 z-10"
                                                >
                                                    {AUDIENCE_OPTIONS.map((opt) => {
                                                        const Icon = opt.icon;
                                                        return (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => { setAudience(opt.id); setShowAudience(false); }}
                                                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors cursor-pointer ${audience === opt.id ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold" : "hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"}`}
                                                            >
                                                                <Icon className="w-4 h-4" />
                                                                <div>
                                                                    <div className="text-xs">{opt.label}</div>
                                                                    <div className="text-[10px] text-gray-400 font-normal">{opt.desc}</div>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Text Area */}
                                <div className="relative">
                                    <textarea
                                        rows={4}
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Say something about this post..."
                                        className="w-full bg-gray-50/70 dark:bg-slate-800/50 rounded-2xl p-4 text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 outline-none border border-gray-100 dark:border-slate-800 focus:border-indigo-500 transition-colors resize-none"
                                    />
                                    <div className="absolute bottom-3 right-3 flex items-center gap-1">
                                        <button className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <Smile className="w-4 h-4" />
                                        </button>
                                        <button className="p-1.5 text-gray-400 hover:text-indigo-500 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                            <AtSign className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-7 py-4 bg-gray-50/50 dark:bg-slate-800/30 border-t border-gray-100 dark:border-slate-800 flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onClose}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-vibrant text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 cursor-pointer"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Share Now</span>
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SahreModal;
