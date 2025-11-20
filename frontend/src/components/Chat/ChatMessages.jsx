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
  const bottomOfMessageRef = useRef(null);

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getMessages(roomId),
    enabled: !!roomId,
  });

  useEffect(() => {
    const handleUserTyping = ({ roomId: incomingRoomId, userId }) => {
      if (parseInt(incomingRoomId) !== parseInt(roomId)) return;
      if (userId === user?.id) return;
      setTypingUsers((prev) => prev.includes(userId) ? prev : [...prev, userId]);
    };

    const handleUserStopTyping = ({ roomId: incomingRoomId, userId }) => {
      if (parseInt(incomingRoomId) !== parseInt(roomId)) return;
      if (userId === user?.id) return;
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    };


    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStopTyping);

    return () => {
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStopTyping);
      setTypingUsers([]);
    }
  }, [roomId, user?.id]);

  useEffect(() => {
    bottomOfMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!roomId) return;

    const handleNewMessage = (newMessage) => {
      queryClient.setQueryData(["messages", roomId], (old = []) => {
        if (!old) return [newMessage];
        const tempIndex = old.findIndex(
          (msg) => msg.pending && msg.text === newMessage.text && msg.senderId === newMessage.senderId
        );
        if (tempIndex !== -1) {
          const copy = [...old];
          copy[tempIndex] = newMessage;
          return copy;
        }
        if (old.some((msg) => msg.id === newMessage.id)) return old;
        return [...old, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [roomId]);

  const handleMessageRead = ({ messageId, userId, roomId }) => {
    const currentMessages = queryClient.getQueryData(["messages", roomId]);

    // console.log("Cache before update:", currentMessages);

    if (!currentMessages || currentMessages.length === 0) {
      // console.log("Cache empty, invalidating query...");
      queryClient.invalidateQueries(["messages", roomId]);
      return;
    }

    queryClient.setQueryData(["messages", roomId], (old = []) => {
      return old.map((msg) => {
        if (msg?.id === messageId) {
          return {
            ...msg,
            readBy: msg?.readBy?.some(r => r.id === userId)
              ? msg.readBy
              : [...(msg.readBy || []), { id: userId }]
          };
        }
        return msg;
      });
    });
  };


  useEffect(() => {
    if (!roomId || !user) return;

    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("messageRead", handleMessageRead);
    }
  }, [roomId, user?.id]);

  const otherMembers = queryClient
    .getQueryData(["rooms"])
    ?.find((r) => r.id === parseInt(roomId))?.members.filter((m) => m.user.id !== user?.id) || [];

  const deleteMutation = useMutation({
    mutationFn: (messageId) => deleteMessage(messageId),
    onMutate: async (messageId) => {
      await queryClient.cancelQueries({ queryKey: ["messages", roomId] });

      const previousMessages = queryClient.getQueryData(["messages", roomId]);

      queryClient.setQueryData(["messages", roomId], (old = []) =>
        old.filter((msg) => msg.id !== messageId)
      );

      return { previousMessages };
    },
    onError: (error, messageId, context) => {
      console.error("Error deleting message:", error);
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", roomId], context.previousMessages);
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["rooms"]);
      queryClient.invalidateQueries(["messages", roomId]);
      console.log("Message deleted successfully", data);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["messages", roomId]);
    }
  })

  const handleDeleteMessage = (messageId) => {
    deleteMutation.mutate(messageId);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching messages</div>;
  }

  return (
    <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 scrollbar-hide">
      {messages.map((msg) => {
        // console.log("Message in chat",msg);
        const mine = msg.senderId === user?.id;
        return (
          <motion.div
            key={`${msg.id}-${msg.createdAt}`}
            initial={{ x: msg.mine ? 40 : -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className={`flex ${mine ? "justify-end" : "items-start gap-3"}`}
          >
            {/* Avatar for other user */}
            {!mine && (
              <div className="w-9 h-9 rounded-full mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow capitalize">
                {msg.sender?.profileImage ? (
                  <img
                    src={msg.sender.profileImage}
                    alt={msg.sender.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  msg.sender?.name?.charAt(0)
                )}
              </div>
            )}

            {/* Message bubble */}
            <MessageBubble message={msg} currentUserId={user?.id} roomMembers={otherMembers || []} handleMessageRead={handleMessageRead} onDelete={handleDeleteMessage} />
          </motion.div>
        )
      })}
      <TypingIndicator typingUsers={typingUsers} otherMembers={otherMembers} />
      <div ref={bottomOfMessageRef}></div>
    </div>
  );
};

export default ChatMessages;