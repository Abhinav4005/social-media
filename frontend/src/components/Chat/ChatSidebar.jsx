import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, Plus, X, MessageSquare, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../../Modal/CreateGroupModal";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [search, setSearch] = useState("");
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.presence);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    enabled: true,
  });

  const rooms = data || [];

  const chatList = useMemo(() => {
    return rooms.map((room) => {
      const otherMember = room.members?.find((m) => m?.user?.id !== user?.id);
      return {
        id: room.id,
        name:
          otherMember && room.type === "DM"
            ? otherMember?.user?.name || "Unknown User"
            : room.name || "Unnamed Group",
        profileImage: room.type === "DM" ? otherMember?.user?.profileImage : null,
        lastMessage: room.messages[0]?.text || "No messages yet",
        userId: otherMember?.user?.id || null,
        type: room.type,
      };
    });
  }, [rooms, user]);

  const userList = useMemo(() => chatList.filter((c) => c.userId), [chatList]);
  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleCloseModal = useCallback(() => setOpenCreateGroupModal(false), []);

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);

  // ── Loading skeleton ──────────────────────────────────────────────────────────
  if (isLoading)
    return (
      <div className="w-[280px] flex-shrink-0 flex flex-col h-full" style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #1a1744 100%)" }}>
        <div className="px-5 pt-6 pb-5 border-b border-white/8">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-white/10 animate-pulse" />
            <div className="h-4 w-20 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div className="h-10 rounded-xl bg-white/8 animate-pulse" />
        </div>
        <div className="px-4 pt-4 space-y-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse" style={{ opacity: 1 - i * 0.13 }}>
              <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded-md bg-white/10" style={{ width: `${50 + (i % 3) * 20}%` }} />
                <div className="h-2.5 rounded-md bg-white/6" style={{ width: `${35 + (i % 2) * 25}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="w-[280px] flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #1a1744 100%)" }}>
        <p className="text-sm text-white/40 font-medium">Failed to load chats</p>
      </div>
    );

  // ── Chat item ─────────────────────────────────────────────────────────────────
  const ChatItem = ({ chat }) => {
    const isActive = activeChat === chat.id;
    const isOnline = chat.userId && onlineUsers.includes(chat.userId);

    return (
      <motion.div
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.985 }}
        onClick={() => handleChatClick(chat.id)}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
          isActive
            ? "bg-white/15 shadow-sm"
            : "hover:bg-white/8"
        }`}
      >
        {/* Active left bar */}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-white" />
        )}

        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {chat.profileImage ? (
            <img
              src={chat.profileImage}
              alt={chat.name}
              className={`w-10 h-10 rounded-full object-cover transition-all ${
                isActive ? "ring-2 ring-white/40 ring-offset-1 ring-offset-transparent" : "ring-1 ring-white/10"
              }`}
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              {getInitials(chat.name)}
            </div>
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#1e1b4b] rounded-full shadow-sm" />
          )}
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className={`text-[13px] font-bold truncate leading-tight ${isActive ? "text-white" : "text-white/75"}`}>
            {chat.name}
          </p>
          <p className={`text-[11px] truncate mt-0.5 font-medium ${isActive ? "text-white/55" : "text-white/35"}`}>
            {chat.lastMessage}
          </p>
        </div>

        {/* Type badge for groups */}
        {chat.type === "GROUP" && (
          <div className="flex-shrink-0 w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
            <Users className="w-3 h-3 text-white/40" />
          </div>
        )}
      </motion.div>
    );
  };

  // ── Main render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="w-[280px] flex-shrink-0 flex flex-col h-full"
      style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #1a1744 60%, #16133d 100%)" }}
    >
      {/* ── Header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/8">
        {/* Brand row */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
            whileHover={{ x: -1 }}
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-black/30"
              style={{ background: "var(--gradient-vibrant)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
            <span className="text-[17px] font-black text-white tracking-tight">
              mysocial.
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setOpenCreateGroupModal(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-black text-white shadow-md shadow-black/20 cursor-pointer border border-white/15 bg-white/10 hover:bg-white/15 transition-all"
          >
            <Plus className="w-3 h-3" />
            New
          </motion.button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-[13px] rounded-xl bg-white/8 border border-white/10 hover:bg-white/12 focus:bg-white/15 focus:border-white/25 outline-none text-white placeholder-white/30 font-medium transition-all"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/15 text-white/40 hover:text-white/70 transition cursor-pointer"
              >
                <X className="w-3 h-3" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto px-3 py-3 scrollbar-hide">
        <p className="px-3 pb-2 text-[10px] font-black text-white/30 uppercase tracking-[0.18em]">
          Conversations · {filteredChats.length}
        </p>

        {filteredChats.length > 0 ? (
          <div className="space-y-0.5">
            {filteredChats.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center mb-3">
              <MessageSquare className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-[13px] font-bold text-white/50">
              {search ? `No results for "${search}"` : "No conversations yet"}
            </p>
            <p className="text-[11px] text-white/30 mt-1 font-medium leading-relaxed">
              {search ? "Try a different name" : "Start a new chat or create a group"}
            </p>
          </div>
        )}
      </div>

      {/* ── User profile strip at bottom ── */}
      <div className="px-4 py-3 border-t border-white/8 flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background: "var(--gradient-primary)" }}>
              {getInitials(user?.name || "")}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 border-[1.5px] border-[#1e1b4b] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-white/80 truncate">{user?.name}</p>
          <p className="text-[10px] text-white/35 font-medium">Active now</p>
        </div>
      </div>

      {/* ── Mobile FAB ── */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpenCreateGroupModal(true)}
        className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-2xl cursor-pointer text-white flex items-center justify-center shadow-xl shadow-indigo-900/50"
        style={{ background: "var(--gradient-primary)" }}
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      <CreateGroupModal
        isOpen={openCreateGroupModal}
        onClose={handleCloseModal}
        chatList={userList}
      />
    </div>
  );
};

export default ChatSidebar;
