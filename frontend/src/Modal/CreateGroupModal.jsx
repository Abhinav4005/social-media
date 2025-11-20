import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Users } from "lucide-react";
import Button from "../components/UI/Button";
import { useMutation } from "@tanstack/react-query";
import { createOrGetRoom } from "../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CreateGroupModal = ({ isOpen, onClose, chatList }) => {
    if (!isOpen) return null;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useSelector((state) => state.auth);
    console.log("Current User:", user);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [groupName, setGroupName] = useState("");
    console.log("Chat List:", chatList);

    const filterChat = chatList.filter((chat) => {
        return chat.name.toLowerCase().includes(search.toLowerCase());
    })

    const toggleUser = (userId) => {
        if(!userId) return;
        setSelectedUsers((prev) => {
            return prev?.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId];
        })
    }

    const mutation = useMutation({
        mutationFn: () => createOrGetRoom(groupName, "GROUP", selectedUsers),
        onSuccess: (room) => {
            queryClient.invalidateQueries(["rooms"]);
            navigate(`/chat/${room?.id}`)
            setTimeout(() => onClose(), 0)
        },
        onError: (err) => {
            console.error("Group creation failed:", err)
        }
    })

    // console.log("Selected Users:", selectedUsers)

    const handleCreateGroup = () => {
        mutation.mutate();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 relative"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                        <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Create New Group
                    </h2>
                </div>

                {/* Form Inputs */}
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter group name"
                        name="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm 
                       bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Search users to add..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-sm 
                       bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                        {filterChat.length > 0 ? (
                            filterChat.map((chat) => (
                                <label
                                    key={chat.id}
                                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(chat.userId)}
                                        onChange={() => toggleUser(chat.userId)}
                                        className="accent-blue-500"
                                    />
                                    <img
                                        src={chat.profileImage || "/default-avatar.png"}
                                        alt={chat.name}
                                        className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-200">{chat.name}</span>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">No users found</p>
                        )}
                    </div>

                    {selectedUsers.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {selectedUsers.map((userId) => {
                                const user = chatList.find((chat) => chat.userId === userId);
                                return (
                                    <span
                                        key={userId}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs capitalize"
                                    >
                                        {user ? user.name : "Unknown User"}
                                    </span>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                    <Button
                        onClick={handleCreateGroup}
                        className="flex-1 bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md"
                    >
                        Create Group
                    </Button>
                    <Button
                        onClick={onClose}
                        className="flex-1 bg-gray-500 cursor-pointer hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Cancel
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default CreateGroupModal;