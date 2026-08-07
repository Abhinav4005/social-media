import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Search, Check, UserPlus, Hash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrGetRoom } from "../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

/* ── Avatar gradient palette (same as CommentModal) ─────────── */
const GRADIENTS = [
    ["#6366f1", "#8b5cf6"],
    ["#ec4899", "#f43f5e"],
    ["#f59e0b", "#f97316"],
    ["#10b981", "#14b8a6"],
    ["#3b82f6", "#6366f1"],
    ["#a855f7", "#ec4899"],
];
function getGradient(name = "") {
    const code = [...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
    return GRADIENTS[code % GRADIENTS.length];
}
function Avatar({ name = "", src, size = 9 }) {
    const [c1, c2] = getGradient(name);
    const initials = name.slice(0, 2).toUpperCase();
    if (src) return (
        <img src={src} alt={name}
            className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0 ring-2 ring-white dark:ring-slate-800`} />
    );
    return (
        <div
            className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-white dark:ring-slate-800`}
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
        >
            {initials}
        </div>
    );
}

const MAX_NAME = 40;

const CreateGroupModal = ({ isOpen, onClose, chatList }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useSelector((state) => state.auth);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [nameFocused, setNameFocused] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const searchRef = useRef(null);

    const filterChat = chatList.filter((chat) =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    const toggleUser = (userId) => {
        if (!userId) return;
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const mutation = useMutation({
        mutationFn: () => createOrGetRoom(groupName, "GROUP", selectedUsers),
        onSuccess: (room) => {
            queryClient.invalidateQueries(["rooms"]);
            navigate(`/chat/${room?.id}`);
            setTimeout(() => onClose(), 0);
        },
        onError: (err) => console.error("Group creation failed:", err),
    });

    const handleCreateGroup = () => mutation.mutate();
    const canCreate = groupName.trim().length > 0 && selectedUsers.length > 0 && !mutation.isLoading;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center px-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.94, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.94, opacity: 0, y: 24 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="w-full max-w-md bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/60 dark:border-slate-700/50 rounded-[28px] shadow-2xl overflow-hidden flex flex-col"
                    style={{ maxHeight: "90vh" }}
                >
                    {/* ── Gradient accent bar ── */}
                    <div className="h-1 w-full bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />

                    {/* ── Header ── */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-5">
                        <div className="flex items-center gap-3.5">
                            {/* Icon with glow */}
                            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-300/50 dark:shadow-primary-900/40">
                                <Users className="w-5 h-5 text-white" />
                                <span className="absolute inset-0 rounded-2xl ring-2 ring-primary-300/30 animate-pulse pointer-events-none" />
                            </div>
                            <div>
                                <h2 className="text-[17px] font-bold text-gray-900 dark:text-gray-100 tracking-tight leading-none">
                                    New Group
                                </h2>
                                <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 mt-0.5 uppercase tracking-widest">
                                    Create a chat group
                                </p>
                            </div>
                        </div>

                        {/* Close button */}
                        <motion.button
                            whileHover={{ scale: 1.08, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-500 dark:text-gray-400 transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </motion.button>
                    </div>

                    {/* Gradient divider */}
                    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-700 to-transparent mb-5" />

                    {/* ── Body (scrollable) ── */}
                    <div className="flex-1 overflow-y-auto px-6 pb-2 space-y-5 scrollbar-hide">

                        {/* Group Name */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                <Hash className="w-3 h-3" />
                                Group Name
                            </label>
                            <motion.div
                                animate={nameFocused
                                    ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.18)" }
                                    : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
                                }
                                transition={{ duration: 0.2 }}
                                className={`rounded-2xl border transition-colors duration-200 ${nameFocused
                                    ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800"
                                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60"
                                    }`}
                            >
                                <input
                                    type="text"
                                    placeholder="e.g. Design Team, Weekend Plans…"
                                    value={groupName}
                                    maxLength={MAX_NAME}
                                    onChange={(e) => setGroupName(e.target.value)}
                                    onFocus={() => setNameFocused(true)}
                                    onBlur={() => setNameFocused(false)}
                                    className="w-full bg-transparent px-4 py-3.5 text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none"
                                />
                            </motion.div>
                            {/* Character counter */}
                            <div className="flex justify-end">
                                <span className={`text-[10px] font-medium tabular-nums ${groupName.length > MAX_NAME * 0.85 ? "text-amber-500" : "text-gray-300 dark:text-gray-600"}`}>
                                    {groupName.length}/{MAX_NAME}
                                </span>
                            </div>
                        </div>

                        {/* Member search */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                <Users className="w-3 h-3" />
                                Add Members
                            </label>
                            <motion.div
                                animate={searchFocused
                                    ? { boxShadow: "0 0 0 3px rgba(99,102,241,0.18)" }
                                    : { boxShadow: "0 0 0 0px rgba(99,102,241,0)" }
                                }
                                transition={{ duration: 0.2 }}
                                className={`flex items-center gap-2 px-4 py-3 rounded-2xl border transition-colors duration-200 ${searchFocused
                                    ? "border-primary-400 dark:border-primary-500 bg-white dark:bg-slate-800"
                                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/60"
                                    }`}
                            >
                                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    ref={searchRef}
                                    type="text"
                                    placeholder="Search people…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setSearchFocused(false)}
                                    className="bg-transparent text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 outline-none flex-1"
                                />
                                <AnimatePresence>
                                    {search && (
                                        <motion.button
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                                            className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer flex-shrink-0"
                                        >
                                            <X className="w-4 h-4" />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* Selected chips */}
                        <AnimatePresence>
                            {selectedUsers.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex flex-wrap gap-2 py-1">
                                        {selectedUsers.map((userId) => {
                                            const person = chatList.find((c) => c.userId === userId);
                                            const [c1] = getGradient(person?.name);
                                            return (
                                                <motion.span
                                                    key={userId}
                                                    initial={{ scale: 0.8, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0.8, opacity: 0 }}
                                                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full text-xs font-semibold border"
                                                    style={{
                                                        background: `${c1}15`,
                                                        borderColor: `${c1}40`,
                                                        color: c1,
                                                    }}
                                                >
                                                    <Avatar name={person?.name} src={person?.profileImage} size={5} />
                                                    <span className="max-w-[80px] truncate">{person?.name || "Unknown"}</span>
                                                    <button
                                                        onClick={() => toggleUser(userId)}
                                                        className="ml-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer flex-shrink-0"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </motion.span>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* People list */}
                        <div className="space-y-1 pb-1">
                            {filterChat.length > 0 ? (
                                filterChat.map((chat) => {
                                    const isSelected = selectedUsers.includes(chat.userId);
                                    const [c1, c2] = getGradient(chat.name);
                                    return (
                                        <motion.button
                                            key={chat.id}
                                            whileHover={{ x: 3 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => toggleUser(chat.userId)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer text-left group ${isSelected
                                                ? "bg-primary-50 dark:bg-primary-900/20"
                                                : "hover:bg-gray-50 dark:hover:bg-slate-800/60"
                                                }`}
                                        >
                                            {/* Avatar with selection ring */}
                                            <div className="relative flex-shrink-0">
                                                <Avatar name={chat.name} src={chat.profileImage} size={9} />
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            exit={{ scale: 0 }}
                                                            className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary-600 border-2 border-white dark:border-slate-900 flex items-center justify-center"
                                                        >
                                                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            {/* Name */}
                                            <span className={`flex-1 text-sm font-semibold transition-colors ${isSelected ? "text-primary-700 dark:text-primary-400" : "text-gray-800 dark:text-gray-200"}`}>
                                                {chat.name}
                                            </span>

                                            {/* Checkbox ring */}
                                            <motion.div
                                                animate={isSelected
                                                    ? { backgroundColor: "#4f46e5", borderColor: "#4f46e5", scale: 1 }
                                                    : { backgroundColor: "transparent", borderColor: "#d1d5db", scale: 1 }
                                                }
                                                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                                            >
                                                <AnimatePresence>
                                                    {isSelected && (
                                                        <motion.div
                                                            initial={{ scale: 0, opacity: 0 }}
                                                            animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0, opacity: 0 }}
                                                        >
                                                            <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        </motion.button>
                                    );
                                })
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex flex-col items-center justify-center py-10 text-center"
                                >
                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                        <Search className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                    </div>
                                    <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">No people found</p>
                                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">Try a different name</p>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="px-6 py-4 border-t border-gray-100/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
                        <div className="flex gap-3">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Cancel
                            </motion.button>

                            <motion.button
                                whileHover={canCreate ? { scale: 1.02 } : {}}
                                whileTap={canCreate ? { scale: 0.97 } : {}}
                                onClick={handleCreateGroup}
                                disabled={!canCreate}
                                className={`flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer ${canCreate
                                    ? "bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-200/60 dark:shadow-primary-900/40"
                                    : "bg-gray-200 dark:bg-slate-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                                    }`}
                            >
                                {mutation.isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        Creating…
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        Create
                                        {selectedUsers.length > 0 && (
                                            <motion.span
                                                key={selectedUsers.length}
                                                initial={{ scale: 0.7, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold"
                                            >
                                                {selectedUsers.length}
                                            </motion.span>
                                        )}
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateGroupModal;

