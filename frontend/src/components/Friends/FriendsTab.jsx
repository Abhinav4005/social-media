import React, { useState } from "react";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, UserMinus, Mail, ChevronRight } from "lucide-react";

const FriendsTab = ({ activeTab, followers, following, isLoading, isError }) => {
  if (activeTab !== "friends") return null;
  const [tab, setTab] = useState("following");
  const navigate = useNavigate();

  const handleOpenDetail = (userId) => {
    navigate(`/friends/${userId}`);
  }

  const renderList = (list, loading, error, label) => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-indigo-100 rounded-full mb-4"></div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Looking for friends...</p>
      </div>
    );

    if (error) return (
      <div className="text-center py-12 bg-red-50 rounded-[32px] border border-red-100">
        <p className="text-red-500 font-black">Failed to load connection</p>
      </div>
    );

    if (!list || list.length === 0) return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
        <p className="text-gray-300 font-black uppercase tracking-[0.2em] italic opacity-60">No echoes yet</p>
      </div>
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {list.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,1)" }}
            className="flex items-center gap-5 p-5 bg-white/60 backdrop-blur-xl rounded-[28px] cursor-pointer shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] border border-white hover:border-indigo-100 transition-all group"
            onClick={() => handleOpenDetail(user?.id)}
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-black shadow-lg">
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0]?.toUpperCase())
                  .slice(0, 2)
                  .join("")}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors truncate text-lg tracking-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 text-gray-400/80">
                <Mail className="w-3.5 h-3.5" />
                <p className="text-[10px] font-black uppercase tracking-wider truncate">{user.email || "Private Account"}</p>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`p-3 rounded-2xl transition-all ${tab === "followers" ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-100 text-gray-400 group-hover:bg-red-50 group-hover:text-red-500'}`}
            >
              {tab === "followers" ? <UserPlus className="w-5 h-5" /> : <UserMinus className="w-5 h-5" />}
            </motion.div>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-10 p-1.5 bg-gray-100/50 backdrop-blur-md rounded-[24px] w-fit mx-auto border border-white/50">
        <button
          onClick={() => setTab("followers")}
          className={`px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === "followers" ? "bg-white text-indigo-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Followers
        </button>
        <button
          onClick={() => setTab("following")}
          className={`px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${tab === "following" ? "bg-white text-indigo-600 shadow-xl" : "text-gray-400 hover:text-gray-600"
            }`}
        >
          Following
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "followers" && renderList(followers.map(user => user.follower), isLoading, isError, "followers")}
          {tab === "following" && renderList(following.map(user => user.following), isLoading, isError, "following")}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FriendsTab;
