import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Search, Pin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../../api";

const ChatSidebar = () => {
  const pinnedChats = ["Team Group"];
  const chats = ["Paras", "Anjali", "Developer Hub"];

  const [activeChat, setActiveChat] = useState("Paras");
  const [search, setSearch] = useState("");

  // Filtered lists
  const filteredPinned = pinnedChats.filter((chat) =>
    chat.toLowerCase().includes(search.toLowerCase())
  );
  const filteredChats = chats.filter((chat) =>
    chat.toLowerCase().includes(search.toLowerCase())
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    enabled: true
  });

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  if (isError) {
    return <div>Error fetching rooms</div>;
  }

  const rooms = data || [];

  // Reusable chat card
  const ChatItem = ({ chat, isPinned = false }) => (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setActiveChat(chat)}
      className={`p-3 rounded-xl cursor-pointer flex items-center gap-3 transition backdrop-blur-lg 
        ${
          activeChat === chat
            ? "bg-blue-500/90 text-white shadow-md border-l-4 border-blue-700"
            : "bg-white/70 dark:bg-gray-800/70 hover:bg-white dark:hover:bg-gray-700 shadow-sm hover:shadow-md"
        }`}
    >
      <motion.div
        whileHover={{ rotate: 10 }}
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow 
          ${
            activeChat === chat
              ? "bg-white text-blue-600"
              : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
          }`}
      >
        {chat.charAt(0)}
      </motion.div>
      <div className="flex-1">
        <p
          className={`font-medium ${
            activeChat === chat ? "text-white" : "text-gray-800 dark:text-gray-200"
          }`}
        >
          {chat}
        </p>
        <p
          className={`text-xs truncate ${
            activeChat === chat ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          Last message preview...
        </p>
      </div>
      {isPinned && (
        <Pin
          className={`w-4 h-4 ${
            activeChat === chat ? "text-white" : "text-gray-400 dark:text-gray-500"
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
        className="flex items-center gap-2 mb-6"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg">
          <MessageCircle className="text-white w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          MySocial
        </h1>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative mb-4"
      >
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm"
        />
      </motion.div>

      {/* Pinned Chats */}
      {filteredPinned.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
            <Pin className="w-3 h-3" /> Pinned
          </h2>
          <div className="space-y-3 mb-4">
            {filteredPinned.map((chat, i) => (
              <ChatItem key={i} chat={chat} isPinned />
            ))}
          </div>
        </>
      )}

      {/* Normal Chats */}
      <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
        All Chats
      </h2>
      <div className="space-y-3 overflow-y-auto scrollbar-hide">
        {data.length > 0 ? (
          console.log("data", data),
          data.map((chat, i) => <ChatItem key={i} chat={chat} />)
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            No chats found
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;