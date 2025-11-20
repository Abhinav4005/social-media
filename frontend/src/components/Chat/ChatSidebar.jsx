import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Pin, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../api";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../../Modal/CreateGroupModal";

const ChatSidebar = ({ activeChat, setActiveChat }) => {
  const [search, setSearch] = useState("");
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, lastSeen } = useSelector((state) => state.presence);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["rooms"],
    queryFn: getRooms,
    enabled: true,
  });

  const rooms = data || [];

  // Transform API data -> usable chat list
  const chatList = useMemo(() => {
    return (rooms || []).map((room) => {
      const otherMember = room.members?.find((m) => m?.user?.id !== user?.id)
      return {
        id: room.id,
        name: (otherMember && room.type === "DM") ? otherMember?.user?.name || "Unknown User" : room.name || "Unnamed Group",
        profileImage: room.type === "DM" ? otherMember?.user?.profileImage : null,
        lastMessage: room.messages[0]?.text || "No messages yet",
        userId: otherMember?.user?.id || null
      }
    })
  }, [rooms, user]);

  const userList = useMemo(() => {
    return chatList.filter(chat => chat.userId);
  }, [chatList]);

  // Filter by search
  const filteredChats = chatList.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChatClick = (chatId) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  }

  const handleCloseModal = useCallback(() => {
    setOpenCreateGroupModal(false);
  }, [])

  if (isLoading) return <div>Loading rooms...</div>;
  if (isError) return <div>Error fetching rooms</div>;

  // Chat Item Component
  const ChatItem = ({ chat, isPinned = false }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => handleChatClick(chat.id)}
      className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition backdrop-blur-lg 
        ${activeChat === chat.id
          ? "bg-blue-500/90 text-white shadow-md border-l-4 border-blue-700"
          : "bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
        }`}
    >
      {/* Profile Image / Avatar */}
      <div className="relative w-10 h-10">
        {chat.profileImage ? (
          <img
            src={chat.profileImage}
            alt={chat.name}
            className="w-10 h-10 rounded-full object-cover shadow"
          />
        ) : (
          <motion.div
            whileHover={{ rotate: 10 }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow capitalize 
        ${activeChat === chat.id
                ? "bg-white text-blue-600"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
              }`}
          >
            {chat.name?.charAt(0)}
          </motion.div>
        )}

        {/* ✅ Online Indicator */}
        {chat.userId && onlineUsers.includes(chat.userId) && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></span>
        )}
      </div>


      {/* Name + Last Message */}
      <div className="flex-1">
        <p
          className={`font-medium ${activeChat === chat.id
            ? "text-white"
            : "text-gray-800 dark:text-gray-200"
            }`}
        >
          {chat.name}
        </p>
        <p
          className={`text-xs truncate ${activeChat === chat.id
            ? "text-blue-100"
            : "text-gray-500 dark:text-gray-400"
            }`}
        >
          {chat.lastMessage}
        </p>
      </div>

      {isPinned && (
        <Pin
          className={`w-4 h-4 ${activeChat === chat.id
            ? "text-white"
            : "text-gray-400 dark:text-gray-500"
            }`}
        />
      )}
    </motion.div>
  );

  return (
    <div className="w-1/4 border-r border-gray-200 dark:border-gray-800 bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 p-4 flex flex-col">
      {/* Logo / Branding */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 mb-6 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
          <MessageCircle className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          MySocial
        </h1>
      </motion.div>

      {/* Search + New Group Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="flex flex-col md:flex-row gap-3 mb-4"
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/70 
                 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 
                 focus:outline-none focus:ring-2 focus:ring-blue-400 
                 text-gray-800 dark:text-gray-200 placeholder-gray-400 
                 dark:placeholder-gray-500 shadow-sm"
          />
        </div>
        {/* Sidebar New Group Button (Desktop/Laptop) */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpenCreateGroupModal(true)}
          className="hidden md:flex items-center justify-center cursor-pointer gap-2 px-3 py-2 text-sm font-medium 
             rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 
             text-white shadow-md hover:shadow-lg md:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Group</span>
        </motion.button>

        {/* Floating FAB (Mobile Only) */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpenCreateGroupModal(true)}
          className="fixed bottom-6 right-6 md:hidden w-12 h-12 rounded-full cursor-pointer
             bg-gradient-to-r from-blue-500 to-indigo-500 text-white 
             flex items-center justify-center shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </motion.button>

      </motion.div>


      {/* All Chats */}
      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        All Chats
      </h2>
      <div className="space-y-3 overflow-y-auto scrollbar-hide">
        {filteredChats.length > 0 ? (
          filteredChats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            No chats found
          </p>
        )}
      </div>
      <CreateGroupModal
        isOpen={openCreateGroupModal}
        onClose={handleCloseModal}
        chatList={userList}
      />
    </div>
  );
};

export default ChatSidebar;