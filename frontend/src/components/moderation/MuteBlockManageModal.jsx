import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, VolumeX, Ban, UserCheck, X, RefreshCw } from "lucide-react";
import { moderationService } from "../../services/moderation.service";
import { privacyService } from "../../services/privacy.service";
import { useToast } from "../../context/ToastContext";

export default function MuteBlockManageModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState("blocked"); // 'blocked' | 'muted'
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [mutedUsers, setMutedUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === "blocked") {
                const res = await privacyService.getBlockedUsers();
                setBlockedUsers(res.data || res.blockedUsers || res || []);
            } else {
                const res = await moderationService.getMutedUsers();
                setMutedUsers(res.data || []);
            }
        } catch (err) {
            console.error("Failed to load list:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId) => {
        try {
            await privacyService.unblockUser(userId);
            setBlockedUsers((prev) => prev.filter((u) => u.id !== userId && u.blockedUserId !== userId));
            addToast?.("User unblocked", "success");
        } catch (err) {
            addToast?.("Failed to unblock user", "error");
        }
    };

    const handleUnmute = async (userId) => {
        try {
            await moderationService.unmuteUser(userId);
            setMutedUsers((prev) => prev.filter((u) => u.mutedUserId !== userId && u.mutedUser?.id !== userId));
            addToast?.("User unmuted", "success");
        } catch (err) {
            addToast?.("Failed to unmute user", "error");
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-2xl p-6 overflow-hidden"
                >
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                <Shield className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Safety Controls</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 my-4 bg-gray-100 dark:bg-slate-800 rounded-2xl">
                        <button
                            onClick={() => setActiveTab("blocked")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "blocked"
                                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                }`}
                        >
                            <Ban className="w-4 h-4 text-red-500" />
                            <span>Blocked Users</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("muted")}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === "muted"
                                    ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                                }`}
                        >
                            <VolumeX className="w-4 h-4 text-amber-500" />
                            <span>Muted Users</span>
                        </button>
                    </div>

                    {/* List Content */}
                    <div className="min-h-[220px] max-h-72 overflow-y-auto space-y-2 pr-1">
                        {loading ? (
                            <div className="flex items-center justify-center py-12 text-gray-400">
                                <RefreshCw className="w-6 h-6 animate-spin" />
                            </div>
                        ) : activeTab === "blocked" ? (
                            blockedUsers.length === 0 ? (
                                <p className="text-center py-10 text-xs text-gray-400">No blocked users.</p>
                            ) : (
                                blockedUsers.map((item) => {
                                    const target = item.blockedUser || item.user || item;
                                    return (
                                        <div
                                            key={target.id || item.id}
                                            className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                                                    {target.name?.[0] || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 dark:text-white">{target.name || "User"}</p>
                                                    <p className="text-[10px] text-gray-400">{target.email || ""}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleUnblock(target.id)}
                                                className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    );
                                })
                            )
                        ) : mutedUsers.length === 0 ? (
                            <p className="text-center py-10 text-xs text-gray-400">No muted users.</p>
                        ) : (
                            mutedUsers.map((item) => {
                                const target = item.mutedUser || item;
                                return (
                                    <div
                                        key={target.id || item.id}
                                        className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-100 dark:border-slate-800"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center text-xs font-bold">
                                                {target.name?.[0] || "M"}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white">{target.name || "User"}</p>
                                                <p className="text-[10px] text-gray-400">Muted</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleUnmute(target.id)}
                                            className="px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                        >
                                            Unmute
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
