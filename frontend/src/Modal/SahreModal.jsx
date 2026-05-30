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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.93, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.93, opacity: 0, y: 20 }}
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="fixed inset-0 flex items-center justify-center z-50 px-4"
                    >
                        <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.2)] overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
                                <div className="flex items-center gap-3">
                                    {user?.profileImage ? (
                                        <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-100" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center text-white font-black text-sm">
                                            {user?.name?.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-black text-gray-900">{user?.name}</p>
                                        {/* Audience picker */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowAudience(!showAudience)}
                                                className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-primary-600 transition-colors cursor-pointer mt-0.5"
                                            >
                                                <AudienceIcon className="w-3 h-3" />
                                                {selectedAudience?.label}
                                                <span className="text-gray-300">▾</span>
                                            </button>

                                            <AnimatePresence>
                                                {showAudience && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                                        className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-10 w-44"
                                                    >
                                                        {AUDIENCE_OPTIONS.map((opt) => {
                                                            const Icon = opt.icon;
                                                            return (
                                                                <button
                                                                    key={opt.id}
                                                                    onClick={() => { setAudience(opt.id); setShowAudience(false); }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${audience === opt.id ? "bg-primary-50" : ""}`}
                                                                >
                                                                    <Icon className={`w-4 h-4 ${audience === opt.id ? "text-primary-600" : "text-gray-400"}`} />
                                                                    <div>
                                                                        <p className={`text-xs font-bold ${audience === opt.id ? "text-primary-700" : "text-gray-700"}`}>{opt.label}</p>
                                                                        <p className="text-[10px] text-gray-400">{opt.desc}</p>
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Text area */}
                            <div className="px-7 py-5">
                                <textarea
                                    rows="5"
                                    placeholder={`What's on your mind, ${user?.name?.split(" ")[0] || "there"}?`}
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    className="w-full resize-none outline-none text-gray-700 placeholder-gray-300 text-[15px] leading-relaxed font-medium"
                                />
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-7 pb-7 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1">
                                    <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer">
                                        <AtSign className="w-5 h-5" />
                                    </button>
                                </div>

                                <motion.button
                                    whileHover={text.trim() ? { scale: 1.03 } : {}}
                                    whileTap={text.trim() ? { scale: 0.97 } : {}}
                                    disabled={!text.trim()}
                                    className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-primary-500 to-secondary-600 shadow-lg shadow-primary-200 disabled:opacity-40 disabled:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
                                >
                                    <Send className="w-4 h-4" />
                                    Share Now
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SahreModal;
