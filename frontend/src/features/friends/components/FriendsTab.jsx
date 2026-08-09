import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, UserMinus, Mail, Users } from "lucide-react";
import UserAvatar from "../../../components/Common/UserAvatar";
import EmptyState from "../../../components/Common/EmptyState";
import TabBar from "../../../components/Common/TabBar";
import { ROUTES } from "../../../constant/routes";

const FriendsTab = ({ activeTab, followers = [], following = [], isLoading, isError }) => {
  const [tab, setTab] = useState("following");
  const navigate = useNavigate();

  if (activeTab !== "friends") return null;

  const handleOpenDetail = (userId) => {
    if (userId) navigate(ROUTES.USER_PROFILE(userId));
  };

  const renderList = (list, loading, error, label) => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <div className="w-12 h-12 bg-primary-100 rounded-full mb-4 animate-bounce"></div>
        <p className="text-gray-400 font-bold uppercase tracking-wider text-xs">Looking for friends...</p>
      </div>
    );

    if (error) return (
      <div className="text-center py-12 bg-red-50 rounded-[32px] border border-red-100/50">
        <p className="text-red-500 font-black">Failed to load connection</p>
      </div>
    );

    if (!list || list.length === 0) return (
      <EmptyState
        icon={Users}
        title="No connections yet"
        description={
          label === "followers"
            ? "When other members follow this account, they will appear here."
            : "When this account follows other members, they will appear here."
        }
      />
    );

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {list.map((user, index) => (
          <motion.div
            key={user?.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className="flex items-center gap-4 p-4.5 bg-white/70 backdrop-blur-xl rounded-[28px] cursor-pointer shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 hover:border-primary-100 hover:bg-white hover:shadow-[0_20px_40px_rgba(99,102,241,0.05)] transition-all group"
            onClick={() => handleOpenDetail(user?.id)}
          >
            <UserAvatar
              name={user?.name}
              profileImage={user?.profileImage}
              size="md"
              shape="circle"
              showOnline={user?.online}
              ring="ring-2 ring-primary-50/50"
            />

            <div className="flex-1 min-w-0">
              <p className="font-extrabold text-gray-900 group-hover:text-primary-600 transition-colors truncate text-base tracking-tight">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                <Mail className="w-3 h-3 text-gray-300" />
                <p className="text-[10px] font-bold truncate tracking-wide">{user?.email || "Private Account"}</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenDetail(user?.id);
              }}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                tab === "followers"
                  ? 'bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700'
                  : 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              {tab === "followers" ? <UserPlus className="w-4.5 h-4.5" /> : <UserMinus className="w-4.5 h-4.5" />}
            </motion.button>
          </motion.div>
        ))}
      </div>
    );
  };

  const TABS = [
    { id: "followers", label: "Followers", badge: followers.length },
    { id: "following", label: "Following", badge: following.length },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <TabBar tabs={TABS} activeTab={tab} onChange={setTab} variant="card" />
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
