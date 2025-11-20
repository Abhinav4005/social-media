import { Check, CheckCheck, Smile, Reply, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { getMessageStatus } from "../../utils/messageStatus";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../../socket";

const MessageBubble = ({
    message,
    currentUserId,
    roomMembers,
    handleMessageRead,
    onReply,
    onReact,
    onEdit,
    onDelete,
}) => {
    const mine = message.senderId === currentUserId;
    const { ref, inView } = useInView({ threshold: 0.8 });

    const [showMenu, setShowMenu] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const menuOpenRef = useRef(null);
    const hasMarkedRead = useRef(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(menuOpenRef.current && !menuOpenRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, []);

    useEffect(() => {
        if (
            !mine && 
            inView && 
            message.id &&
            !hasMarkedRead.current &&
            !message.readBy?.some((r) => r.id === currentUserId)
        ) {
            handleMessageRead({
                messageId: message.id,
                userId: currentUserId,
                roomId: message.roomId,
            });
            socket.emit("messageReadByUser", {
                messageId: message.id,
                userId: currentUserId,
                roomId: message.roomId,
            })
            hasMarkedRead.current = true;
        }
    }, [mine, inView, message.id, currentUserId, handleMessageRead]);

    const status = getMessageStatus(message, currentUserId, roomMembers);

    return (
        <div
            className={`relative flex w-full mb-4 mt-2 ${mine ? "justify-end" : "justify-start"
                }`}
            ref={ref}
        >
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={`relative max-w-[75%] px-3 py-2 rounded-2xl shadow-md group
          ${mine
                        ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }
        `}
            >
                {/* Reply Preview */}
                {message.repliedTo && (
                    <div
                        onClick={() => console.log("Scroll to:", message.repliedTo.id)}
                        className="mb-2 border-l-4 border-blue-400 bg-blue-50 dark:bg-gray-700/40 px-2 py-1 rounded cursor-pointer transition hover:bg-blue-100 dark:hover:bg-gray-700/70"
                    >
                        <div className="font-medium text-xs text-blue-600 dark:text-blue-300 truncate">
                            {message.repliedTo.sender.name}
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate">
                            {message.repliedTo.text}
                        </div>
                    </div>
                )}

                {/* Main Text */}
                {message.attachments && message.attachments.length > 0 && (
                    <div className="flex flex-col gap-2 mb-2">
                        {message.attachments.map((file) => {
                            if (file.mimeType === "IMAGE") {
                                return (
                                    <img
                                        key={file.id}
                                        src={file.url}
                                        alt="attachment"
                                        className="rounded-lg max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition"
                                        onClick={() => window.open(file.url, "_blank")}
                                    />
                                );
                            } else if (file.mimeType === "VIDEO") {
                                return (
                                    <video
                                        key={file.id}
                                        src={file.url}
                                        controls
                                        className="rounded-lg max-w-full h-auto"
                                    />
                                );
                            } else {
                                // For any other file (like PDFs, docs, etc.)
                                const fileName = file.url.split("/").pop();
                                return (
                                    <a
                                        key={file.id}
                                        href={file.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                                    >
                                        📎 <span className="text-sm truncate">{fileName}</span>
                                    </a>
                                );
                            }
                        })}
                    </div>
                )}
                <span className="whitespace-pre-line break-words block text-sm leading-relaxed">
                    {message.text}
                </span>

                {/* Reactions */}
                {message.reactions?.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {message.reactions.map((r, idx) => (
                            <span
                                key={idx}
                                className="text-xs bg-white/70 dark:bg-gray-700/60 px-2 py-0.5 rounded-full shadow cursor-pointer hover:scale-110 transition"
                            >
                                {r.emoji} {r.count}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer: Time + Status */}
                <div
                    className={`flex items-center gap-1 mt-1 text-[11px] ${mine
                        ? "justify-end text-blue-100"
                        : "justify-start text-gray-500 dark:text-gray-400"
                        }`}
                >
                    <span>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </span>
                    {mine && (
                        <>
                            {status === "sent" && <Check size={12} />}
                            {status === "delivered" && <CheckCheck size={12} />}
                            {status === "read" && (
                                <CheckCheck size={12} className="text-blue-300" />
                            )}
                        </>
                    )}
                </div>

                {/* Hover Controls (top-right) */}
                <div
                    className={`absolute -top-6 ${mine ? "right-0" : "left-0"
                        } flex gap-2 bg-gray-700 text-white px-1 py-1 rounded-xl opacity-0 group-hover:opacity-100 transition`}
                >
                    <button
                        onClick={() => onReply(message)}
                        className="p-1 rounded-full hover:bg-gray-800 cursor-pointer dark:hover:bg-gray-700"
                    >
                        <Reply size={16} />
                    </button>
                    <button
                        onClick={() => setShowReactions((p) => !p)}
                        className="p-1 rounded-full hover:bg-gray-800 cursor-pointer dark:hover:bg-gray-700"
                    >
                        <Smile size={16} />
                    </button>
                    {mine && (
                        <button
                            onClick={() => setShowMenu((p) => !p)}
                            className="p-1 rounded-full hover:bg-gray-700 cursor-pointer dark:hover:bg-gray-700"
                        >
                            <MoreVertical size={16} />
                        </button>
                    )}
                </div>

                {/* Emoji Picker Popup */}
                <AnimatePresence>
                    {showReactions && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            className={`absolute flex gap-2 px-2 py-1 rounded-xl shadow-md bg-white dark:bg-gray-800 -top-12 ${mine ? "right-0" : "left-0"
                                }`}
                        >
                            {["👍", "❤️", "😂", "🔥", "😮"].map((emoji) => (
                                <span
                                    key={emoji}
                                    className="cursor-pointer hover:scale-125 transition text-lg"
                                    onClick={() => {
                                        onReact(message, emoji);
                                        setShowReactions(false);
                                    }}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {showMenu && (
                        <motion.div
                            ref={menuOpenRef}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute top-10 right-0 w-32 px-1 py-1 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-20"
                        >
                            {mine && (
                                <>
                                    <button
                                        onClick={() => {
                                            onEdit(message);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 flex items-center rounded-xl cursor-pointer gap-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            onDelete(message);
                                            setShowMenu(false);
                                        }}
                                        className="w-full px-4 py-2 flex items-center gap-2 rounded-xl  cursor-pointer hover:bg-red-100 dark:hover:bg-red-700/30 text-red-500"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default MessageBubble;
