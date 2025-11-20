import { Send, Plus, X } from "lucide-react";
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
  const typingTimeOutRef = useRef(null);
  const fileInputRef = useRef(null);

  const mutation = useMutation({
    mutationFn: (newMessage) => {
      socket.emit("sendMessage", newMessage);
      return newMessage;
    },
    onMutate: async (newMessage) => {
      const tempId = `temp-${Date.now()}`;
      const optimisticMsg = { ...newMessage, id: tempId, pending: true };

      queryClient.setQueryData(["messages", roomId], (old = []) => [
        ...old,
        optimisticMsg,
      ]);

      return { tempId };
    },
    onError: (err, newMessage, context) => {
      console.error("Error sending message:", err);
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", roomId], context.previousMessages);
      }
    },
  });

  const handleSendMessage = async () => {
    if (message.trim() || attachments.length > 0) {

      let uploadedFile = [];
      if(attachments.length > 0) {
        uploadedFile = await uploadImageToKit(attachments);
      }

      console.log("Uploaded Files:", uploadedFile);


      mutation.mutate({
        text: message,
        senderId: user?.id,
        roomId: parseInt(roomId),
        type: uploadedFile.length > 0 ? "MIXED" : "TEXT",
        attachments: uploadedFile,
        replyTo: null,
      });
      setMessage("");
      setAttachments([]);
    }
    socket.emit("stopTyping", { roomId: parseInt(roomId), userId: user?.id });
  };

  const handleTyping = (e) => {
    setMessage(e.target.value);
    socket.emit("isTyping", { roomId: parseInt(roomId), userId: user?.id });

    clearTimeout(typingTimeOutRef.current);
    typingTimeOutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: parseInt(roomId), userId: user?.id });
    }, 2000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const filePreviews = files.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/") ? "image" : "video",
      name: file.name,
      rawFile: file,
    }));
    setAttachments((prev) => [...prev, ...filePreviews]);
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {/* Attachments Section */}
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            className="flex gap-3 overflow-x-auto pb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {attachments.map((file, index) => (
              <motion.div
                key={index}
                className="relative group rounded-xl overflow-hidden shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                {file.type === "image" ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-24 h-24 object-cover"
                  />
                ) : (
                  <video
                    src={file.url}
                    className="w-24 h-24 object-cover"
                    controls
                  />
                )}
                <button
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  onClick={() =>
                    setAttachments(attachments.filter((_, i) => i !== index))
                  }
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Section */}
      <div className="flex items-center gap-3 mt-2 bg-gray-100 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition">
        {/* Plus Button */}
        <button
          className="p-2 text-gray-500 hover:text-blue-500 transition"
          onClick={handlePlusClick}
        >
          <Plus size={22} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          hidden
          onChange={handleFileChange}
        />

        {/* Message Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
        />

        {/* Send Button */}
        <button
          className={`p-2 rounded-full transition ${
            message.trim() || attachments.length > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;