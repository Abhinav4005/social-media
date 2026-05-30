import { motion } from "framer-motion";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getMessages, deleteMessage } from "../../api";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { socket } from "../../../socket";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

const ChatMessages = ({ roomId }) => {
  const { user } = useSelector((state) => state.auth);
  const [typingUsers, setTypingUsers] = useState([]);
  const queryClient = useQueryClient();
  const bottomRef = useRef(null);

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getMessages(roomId),
    enabled: !!roomId,
  });

  useEffect(() => {
    const onTyping = ({ roomId: rid, userId }) => {
      if (parseInt(rid) !== parseInt(roomId) || userId === user?.id) return;
      setTypingUsers((p) => (p.includes(userId) ? p : [...p, userId]));
    };
    const onStop = ({ roomId: rid, userId }) => {
      if (parseInt(rid) !== parseInt(roomId) || userId === user?.id) return;
      setTypingUsers((p) => p.filter((id) => id !== userId));
    };
    socket.on("userTyping", onTyping);
    socket.on("userStoppedTyping", onStop);
    return () => {
      socket.off("userTyping", onTyping);
      socket.off("userStoppedTyping", onStop);
      setTypingUsers([]);
    };
  }, [roomId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;
    const handleNewMessage = (msg) => {
      queryClient.setQueryData(["messages", roomId], (old = []) => {
        const tempIdx = old.findIndex(
          (m) => m.pending && m.text === msg.text && m.senderId === msg.senderId
        );
        if (tempIdx !== -1) {
          const copy = [...old];
          copy[tempIdx] = msg;
          return copy;
        }
        if (old.some((m) => m.id === msg.id)) return old;
        return [...old, msg];
      });
    };
    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [roomId]);

  const handleMessageRead = ({ messageId, userId, roomId }) => {
    const current = queryClient.getQueryData(["messages", roomId]);
    if (!current?.length) { queryClient.invalidateQueries(["messages", roomId]); return; }
    queryClient.setQueryData(["messages", roomId], (old = []) =>
      old.map((msg) =>
        msg?.id === messageId
          ? { ...msg, readBy: msg?.readBy?.some((r) => r.id === userId) ? msg.readBy : [...(msg.readBy || []), { id: userId }] }
          : msg
      )
    );
  };

  useEffect(() => {
    if (!roomId || !user) return;
    socket.on("messageRead", handleMessageRead);
    return () => socket.off("messageRead", handleMessageRead);
  }, [roomId, user?.id]);

  const otherMembers =
    queryClient.getQueryData(["rooms"])?.find((r) => r.id === parseInt(roomId))?.members.filter((m) => m.user.id !== user?.id) || [];

  const deleteMutation = useMutation({
    mutationFn: (messageId) => deleteMessage(messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });
      const prev = queryClient.getQueryData(["messages", roomId]);
      queryClient.setQueryData(["messages", roomId], (old = []) => old.filter((m) => m.id !== messageId));
      return { prev };
    },
    onError: (err, id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["messages", roomId], ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["rooms"]);
      queryClient.invalidateQueries(["messages", roomId]);
    },
  });

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4" style={{ background: "#f0f2f5" }}>
        {["left", "right", "left", "right", "left"].map((side, i) => (
          <div key={i} className={`flex items-end gap-3 ${side === "right" ? "justify-end" : "justify-start"}`}>
            {side === "left" && <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse flex-shrink-0" />}
            <div className={`h-10 rounded-2xl animate-pulse ${side === "right" ? "bg-primary-100" : "bg-gray-100"}`}
              style={{ width: `${100 + (i % 3) * 60}px` }} />
          </div>
        ))}
      </div>
    );
  }

  if (isError) return (
    <div className="flex-1 flex items-center justify-center" style={{ background: "#f0f2f5" }}>
      <p className="text-sm text-gray-400 font-medium">Failed to load messages</p>
    </div>
  );

  // ── Group messages by date ───────────────────────────────────────────────────
  const grouped = messages.reduce((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    if (!acc[date]) acc[date] = [];
    acc[date].push(msg);
    return acc;
  }, {});

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 scrollbar-hide" style={{ background: "#f0f2f5" }}>
      {Object.entries(grouped).map(([date, msgs]) => (
        <div key={date}>
          {/* Date divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-gray-200/60" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] px-3 py-1 bg-white/80 rounded-full border border-gray-200/60 shadow-sm">
              {date}
            </span>
            <div className="flex-1 h-px bg-gray-200/60" />
          </div>

          <div className="space-y-1">
            {msgs.map((msg) => {
              const mine = msg.senderId === user?.id;
              return (
                <motion.div
                  key={`${msg.id}-${msg.createdAt}`}
                  initial={{ x: mine ? 20 : -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 22 }}
                  className={`flex ${mine ? "justify-end" : "items-end gap-2.5"}`}
                >
                  {!mine && (
                    <div className="flex-shrink-0 mb-1">
                      {msg.sender?.profileImage ? (
                        <img
                          src={msg.sender.profileImage}
                          alt={msg.sender.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-gray-200"
                        />
                      ) : (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                          style={{ background: "var(--gradient-primary)" }}
                        >
                          {msg.sender?.name?.charAt(0)?.toUpperCase()}
                        </div>
                      )}
                    </div>
                  )}
                  <MessageBubble
                    message={msg}
                    currentUserId={user?.id}
                    roomMembers={otherMembers}
                    handleMessageRead={handleMessageRead}
                    onDelete={(m) => deleteMutation.mutate(m.id)}
                    onReply={() => {}}
                    onReact={() => {}}
                    onEdit={() => {}}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      <TypingIndicator typingUsers={typingUsers} otherMembers={otherMembers} />
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
