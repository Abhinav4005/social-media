import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Eye, Heart, Send } from "lucide-react";
import { useSelector } from "react-redux";

const REACTIONS = ["❤️", "🔥", "😂", "😮", "👍", "👏"];

const StoryViewerModal = ({ story, isOpen, onClose }) => {
    const { user } = useSelector((state) => state.auth);
    const [reactionSent, setReactionSent] = useState(null);
    const [showViewers, setShowViewers] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isReactingCooldown, setIsReactingCooldown] = useState(false);

    const handleSendReaction = (emoji) => {
        if (isReactingCooldown) return;
        setIsReactingCooldown(true);
        setReactionSent(emoji);
        setTimeout(() => setIsReactingCooldown(false), 1500);
    };

    const storyItem = story?.story || story;
    const author = storyItem?.user || {};
    const isMine = author?.id === user?.id;

    useEffect(() => {
        if (!isOpen) {
            setProgress(0);
            setReactionSent(null);
            setShowViewers(false);
            return;
        }

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    onClose();
                    return 100;
                }
                return prev + 2;
            });
        }, 100);

        return () => clearInterval(timer);
    }, [isOpen, onClose]);

    if (!isOpen || !storyItem) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-sm h-[680px] bg-black rounded-[36px] overflow-hidden shadow-2xl flex flex-col justify-between"
                >
                    {/* Top Progress bar */}
                    <div className="absolute top-3 inset-x-4 z-20 flex gap-1">
                        <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100 ease-linear"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    {/* Top Header */}
                    <div className="absolute top-7 inset-x-4 z-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {author?.profileImage ? (
                                <img
                                    src={author.profileImage}
                                    alt={author.name}
                                    className="w-10 h-10 rounded-full object-cover border-2 border-white/80"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm border-2 border-white/80">
                                    {author?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-black text-white leading-tight">{author?.name || "User"}</p>
                                <p className="text-[10px] text-white/70 font-medium">Just now</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer border border-white/10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Media Content */}
                    <div className="absolute inset-0 z-0">
                        {storyItem.mediaType === "VIDEO" ? (
                            <video
                                src={storyItem.mediaUrl}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <img
                                src={storyItem.mediaUrl || storyItem.image}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                    </div>

                    {/* Bottom caption & controls */}
                    <div className="relative z-20 p-5 mt-auto flex flex-col gap-3">
                        {storyItem.caption && (
                            <p className="text-white text-sm font-semibold text-center bg-black/40 backdrop-blur-md py-2.5 px-4 rounded-2xl border border-white/10">
                                {storyItem.caption}
                            </p>
                        )}

                        {/* Reactions or Viewers bar */}
                        {!isMine ? (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 flex gap-2 overflow-x-auto py-1 scrollbar-hide">
                                    {REACTIONS.map((emoji) => (
                                        <motion.button
                                            key={emoji}
                                            whileHover={!isReactingCooldown ? { scale: 1.25 } : {}}
                                            whileTap={!isReactingCooldown ? { scale: 0.9 } : {}}
                                            disabled={isReactingCooldown}
                                            onClick={() => handleSendReaction(emoji)}
                                            className={`text-2xl cursor-pointer p-1.5 rounded-full hover:bg-white/10 transition-colors ${isReactingCooldown ? "opacity-50 cursor-not-allowed" : ""
                                                }`}
                                        >
                                            {emoji}
                                        </motion.button>
                                    ))}
                                </div>
                                {reactionSent && (
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
                                        {reactionSent} Sent!
                                    </span>
                                )}
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowViewers((v) => !v)}
                                className="w-full py-2.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-all cursor-pointer"
                            >
                                <Eye className="w-4 h-4 text-indigo-400" />
                                Viewers ({(storyItem.views?.length || 0) + 1})
                            </button>
                        )}

                        {/* Viewers Drawer */}
                        <AnimatePresence>
                            {showViewers && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 50, opacity: 0 }}
                                    className="bg-black/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 max-h-48 overflow-y-auto space-y-2"
                                >
                                    <p className="text-xs font-black text-white/70 uppercase tracking-widest mb-2">Story Viewers</p>
                                    <div className="flex items-center justify-between text-white text-xs">
                                        <span className="font-bold">{user?.name} (You)</span>
                                        <span className="text-white/50 text-[10px]">Just now</span>
                                    </div>
                                    {storyItem.views?.map((v, i) => (
                                        <div key={i} className="flex items-center justify-between text-white text-xs">
                                            <span>{v.viewer?.name || `Viewer ${v.viewerId}`}</span>
                                            <span className="text-emerald-400 text-[10px]">❤️</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StoryViewerModal;
