import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Search, Check, UserPlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createOrGetRoom } from "../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CreateGroupModal = ({ isOpen, onClose, chatList }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useSelector((state) => state.auth);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");

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
        onError: (err) => console.error("Group creation failed:", err)
    });

    const handleCreateGroup = () => mutation.mutate();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ scale: 0.93, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.93, opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                    className="w-full max-w-md bg-white rounded-[32px] shadow-[0_40px_80px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-7 pt-7 pb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900 tracking-tight leading-none">New Group</h2>
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Create a chat group</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="px-7 pb-7 space-y-5">
                        {/* Group name input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Group Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Design Team, Weekend Plans..."
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 outline-none focus:border-indigo-300 focus:bg-white transition-all"
                            />
                        </div>

                        {/* Member search */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Add Members</label>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white transition-all">
                                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Search people..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-transparent text-sm font-medium text-gray-800 placeholder-gray-400 outline-none w-full"
                                />
                            </div>
                        </div>

                        {/* Selected chips */}
                        <AnimatePresence>
                            {selectedUsers.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex flex-wrap gap-2"
                                >
                                    {selectedUsers.map((userId) => {
                                        const person = chatList.find((c) => c.userId === userId);
                                        return (
                                            <motion.span
                                                key={userId}
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.8, opacity: 0 }}
                                                className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100"
                                            >
                                                <img
                                                    src={person?.profileImage || `https://ui-avatars.com/api/?name=${person?.name}&background=random`}
                                                    className="w-5 h-5 rounded-full object-cover"
                                                    alt={person?.name}
                                                />
                                                {person?.name || "Unknown"}
                                                <button onClick={() => toggleUser(userId)} className="ml-0.5 text-indigo-400 hover:text-indigo-700 cursor-pointer">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </motion.span>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* People list */}
                        <div className="max-h-44 overflow-y-auto space-y-1 -mx-1 px-1">
                            {filterChat.length > 0 ? (
                                filterChat.map((chat) => {
                                    const isSelected = selectedUsers.includes(chat.userId);
                                    return (
                                        <motion.button
                                            key={chat.id}
                                            whileHover={{ x: 2 }}
                                            onClick={() => toggleUser(chat.userId)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all cursor-pointer text-left ${isSelected ? "bg-indigo-50 border border-indigo-100" : "hover:bg-gray-50"}`}
                                        >
                                            <img
                                                src={chat.profileImage || `https://ui-avatars.com/api/?name=${chat.name}&background=random`}
                                                alt={chat.name}
                                                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                                            />
                                            <span className="flex-1 text-sm font-bold text-gray-800">{chat.name}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300"}`}>
                                                {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                            </div>
                                        </motion.button>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-6 font-medium">No people found</p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-1">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <motion.button
                                whileHover={groupName.trim() && selectedUsers.length > 0 ? { scale: 1.02 } : {}}
                                whileTap={groupName.trim() && selectedUsers.length > 0 ? { scale: 0.97 } : {}}
                                onClick={handleCreateGroup}
                                disabled={!groupName.trim() || selectedUsers.length === 0 || mutation.isLoading}
                                className="flex-1 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-indigo-200 disabled:opacity-40 disabled:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                            >
                                <UserPlus className="w-4 h-4" />
                                {mutation.isLoading ? "Creating..." : `Create${selectedUsers.length > 0 ? ` (${selectedUsers.length})` : ""}`}
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CreateGroupModal;
