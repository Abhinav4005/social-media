import { Check, CheckCheck, Smile, Reply, MoreVertical, Trash2, Edit2 } from "lucide-react";
import { getMessageStatus } from "../../../utils/messageStatus";
import { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { motion, AnimatePresence } from "framer-motion";
import { socket } from "../../../socket";
import SanitizedText from "../../../components/Common/SanitizedText";

const REACTIONS = ["👍", "❤️", "😂", "🔥", "😮", "😢"];

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
  const menuRef = useRef(null);
  const hasMarkedRead = useRef(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
        setShowReactions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (
      !mine &&
      inView &&
      message.id &&
      !hasMarkedRead.current &&
      !message.readBy?.some((r) => r.id === currentUserId)
    ) {
      handleMessageRead({ messageId: message.id, userId: currentUserId, roomId: message.roomId });
      socket.emit("messageReadByUser", { messageId: message.id, userId: currentUserId, roomId: message.roomId });
      hasMarkedRead.current = true;
    }
  }, [mine, inView, message.id, currentUserId, handleMessageRead]);

  const status = getMessageStatus(message, currentUserId, roomMembers);

  const timeStr = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      ref={ref}
      className={`relative flex w-full group ${mine ? "justify-end" : "justify-start"}`}
    >
      {/* Hover action bar */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-150 z-10 ${
          mine ? "right-full mr-2" : "left-full ml-2"
        }`}
      >
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowReactions((p) => !p)}
          className="w-7 h-7 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-amber-500 shadow-sm cursor-pointer transition-colors"
        >
          <Smile className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onReply && onReply(message)}
          className="w-7 h-7 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-primary-600 shadow-sm cursor-pointer transition-colors"
        >
          <Reply className="w-3.5 h-3.5" />
        </motion.button>
        {mine && (
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowMenu((p) => !p)}
            className="w-7 h-7 flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-gray-800 shadow-sm cursor-pointer transition-colors"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>

      {/* Reaction picker */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 6 }}
            transition={{ duration: 0.14 }}
            className={`absolute -top-10 flex gap-1 px-2.5 py-1.5 rounded-2xl bg-white border border-gray-100 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.12)] z-20 ${
              mine ? "right-0" : "left-0"
            }`}
          >
            {REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => { onReact && onReact(message, emoji); setShowReactions(false); }}
                className="text-lg hover:scale-125 transition-transform cursor-pointer leading-none"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Context menu */}
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, scale: 0.92, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -4 }}
            transition={{ duration: 0.13 }}
            className={`absolute top-8 w-36 bg-white rounded-2xl shadow-[0_16px_40px_-8px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden z-20 py-1 ${
              mine ? "right-0" : "left-0"
            }`}
          >
            {mine && (
              <>
                <button
                  onClick={() => { onEdit && onEdit(message); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => { onDelete && onDelete(message); setShowMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-semibold text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className={`relative max-w-[68%] ${
          mine
            ? "rounded-[18px] rounded-br-[5px]"
            : "rounded-[18px] rounded-bl-[5px]"
        } ${
          mine
            ? "text-white shadow-[0_4px_16px_-4px_rgba(99,102,241,0.35)]"
            : "bg-white text-gray-900 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.1)] border border-gray-100/80"
        }`}
        style={mine ? { background: "var(--gradient-primary)" } : {}}
      >
        {/* Reply preview */}
        {message.repliedTo && (
          <div
            className={`mx-3 mt-3 mb-1 px-3 py-2 rounded-xl border-l-[3px] cursor-pointer ${
              mine
                ? "bg-white/15 border-white/50 hover:bg-white/20"
                : "bg-gray-50 border-primary-400 hover:bg-gray-100"
            }`}
          >
            <p className={`text-[10px] font-black truncate ${mine ? "text-white/70" : "text-primary-600"}`}>
              {message.repliedTo.sender?.name}
            </p>
            <p className={`text-[11px] truncate mt-0.5 ${mine ? "text-white/60" : "text-gray-500"}`}>
              {message.repliedTo.text}
            </p>
          </div>
        )}

        {/* Attachments */}
        {message.attachments?.length > 0 && (
          <div className={`flex flex-col gap-1.5 ${message.text ? "mb-2" : ""} ${message.repliedTo ? "mx-3 mt-1" : "m-1.5"}`}>
            {message.attachments.map((file) => {
              if (file.mimeType === "IMAGE") {
                return (
                  <img
                    key={file.id}
                    src={file.url}
                    alt="attachment"
                    className="rounded-xl max-w-full h-auto object-cover cursor-pointer hover:opacity-90 transition"
                    onClick={() => window.open(file.url, "_blank")}
                  />
                );
              } else if (file.mimeType === "VIDEO") {
                return <video key={file.id} src={file.url} controls className="rounded-xl max-w-full h-auto" />;
              } else {
                return (
                  <a
                    key={file.id}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                      mine ? "bg-white/15 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    📎 <span className="truncate">{file.url.split("/").pop()}</span>
                  </a>
                );
              }
            })}
          </div>
        )}

        {/* Text + footer */}
        <div className="px-3.5 pt-2.5 pb-2">
          {message.text && (
            <SanitizedText
              content={message.text}
              className={`text-[13.5px] leading-relaxed whitespace-pre-line break-words ${mine ? "text-white" : "text-gray-800"}`}
            />
          )}

          {/* Reactions */}
          {message.reactions?.length > 0 && (
            <div className="flex gap-1 mt-1.5 flex-wrap">
              {message.reactions.map((r, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full cursor-pointer hover:scale-110 transition ${
                    mine ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  {r.emoji} {r.count}
                </span>
              ))}
            </div>
          )}

          {/* Time + status */}
          <div className={`flex items-center gap-1 mt-1.5 ${mine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] font-medium ${mine ? "text-white/55" : "text-gray-400"}`}>
              {timeStr}
            </span>
            {mine && (
              <span className={mine ? "text-white/55" : "text-gray-400"}>
                {status === "sent" && <Check className="w-3 h-3" />}
                {status === "delivered" && <CheckCheck className="w-3 h-3" />}
                {status === "read" && <CheckCheck className="w-3 h-3 text-sky-300" />}
              </span>
            )}
            {message.pending && (
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessageBubble;
