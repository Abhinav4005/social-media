import { Send, Paperclip, X, Smile, Image as ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { socket } from "../../../socket";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import uploadImageToKit from "../../helper/uploadImage";

const ChatInput = () => {
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const queryClient = useQueryClient();
  const { roomId } = useParams();
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (newMessage) => {
      socket.emit("sendMessage", newMessage);
      return newMessage;
    },
    onMutate: async (newMessage) => {
      const tempId = `temp-${Date.now()}`;
      queryClient.setQueryData(["messages", roomId], (old = []) => [
        ...old,
        { ...newMessage, id: tempId, pending: true },
      ]);
      return { tempId };
    },
    onError: (err, msg, ctx) => {
      if (ctx?.previousMessages)
        queryClient.setQueryData(["messages", roomId], ctx.previousMessages);
    },
  });

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;

    let uploadedFiles = [];
    if (attachments.length > 0) {
      uploadedFiles = await uploadImageToKit(attachments);
    }

    mutation.mutate({
      text: message,
      senderId: user?.id,
      roomId: parseInt(roomId),
      type: uploadedFiles.length > 0 ? "MIXED" : "TEXT",
      attachments: uploadedFiles,
      replyTo: null,
    });

    setMessage("");
    setAttachments([]);
    socket.emit("stopTyping", { roomId: parseInt(roomId), userId: user?.id });
    inputRef.current?.focus();
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("isTyping", { roomId: parseInt(roomId), userId: user?.id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: parseInt(roomId), userId: user?.id });
    }, 2000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      name: file.name,
      rawFile: file,
    }));
    setAttachments((prev) => [...prev, ...previews]);
  };

  const canSend = message.trim().length > 0 || attachments.length > 0;

  return (
    <div className="px-5 py-4 bg-white border-t border-gray-100/80">
      {/* Attachment previews */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2.5 overflow-x-auto pb-3 scrollbar-hide"
          >
            {attachments.map((file, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="relative group flex-shrink-0 rounded-xl overflow-hidden shadow-sm border border-gray-100"
              >
                {file.type === "image" ? (
                  <img src={file.url} alt={file.name} className="w-20 h-20 object-cover" />
                ) : (
                  <video src={file.url} className="w-20 h-20 object-cover" />
                )}
                <button
                  onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <div className="flex items-center gap-2.5">
        {/* Attach */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
        >
          <Paperclip className="w-4.5 h-4.5" />
        </motion.button>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple hidden onChange={handleFileChange} />

        {/* Text input */}
        <div className="flex-1 flex items-center gap-2 bg-gray-50/80 border border-gray-200/80 rounded-2xl px-4 py-2.5 focus-within:bg-white focus-within:border-primary-200 focus-within:ring-4 focus-within:ring-primary-500/8 transition-all">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            className="flex-1 bg-transparent outline-none text-[13px] text-gray-800 placeholder-gray-400 font-medium"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex-shrink-0 text-gray-400 hover:text-amber-500 transition-colors cursor-pointer"
          >
            <Smile className="w-4.5 h-4.5" />
          </motion.button>
        </div>

        {/* Send */}
        <motion.button
          whileHover={canSend ? { scale: 1.08 } : {}}
          whileTap={canSend ? { scale: 0.93 } : {}}
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer ${
            canSend
              ? "text-white shadow-md shadow-primary-200"
              : "bg-gray-100 text-gray-300 cursor-not-allowed"
          }`}
          style={canSend ? { background: "var(--gradient-primary)" } : {}}
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default ChatInput;
