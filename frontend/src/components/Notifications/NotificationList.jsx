import { Bell, ThumbsUp, MessageCircle, UserPlus, Inbox } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "../../pages/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationList({ notifications, isLoading, isError }) {
  const location = useLocation();

  const getIconConfig = (type) => {
    switch (type) {
      case "LIKE":
        return { icon: <ThumbsUp className="w-3.5 h-3.5 text-white" />, bg: "bg-red-500" };
      case "COMMENT":
        return { icon: <MessageCircle className="w-3.5 h-3.5 text-white" />, bg: "bg-indigo-500" };
      case "FOLLOW":
        return { icon: <UserPlus className="w-3.5 h-3.5 text-white" />, bg: "bg-green-500" };
      default:
        return { icon: <Bell className="w-3.5 h-3.5 text-white" />, bg: "bg-gray-400" };
    }
  };

  const getMessage = (type) => {
    switch (type) {
      case "LIKE": return "reacted to your post";
      case "COMMENT": return "commented on your post";
      case "FOLLOW": return "started following you";
      default: return "sent you a notification";
    }
  };

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]?.toUpperCase()).slice(0, 2).join("");

  return (
    <>
      {location.pathname !== "/" && <Navbar />}

      <div className="bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/60 overflow-hidden sticky top-28">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center border border-indigo-100/50">
              <Bell className="w-4 h-4 text-indigo-600" />
            </div>
            <h2 className="text-sm font-extrabold text-gray-800 tracking-tight">Notifications</h2>
          </div>
          {notifications?.length > 0 && (
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full uppercase tracking-wider">
              {notifications.length} new
            </span>
          )}
        </div>

        {/* List */}
        <div className="divide-y divide-gray-50 max-h-[520px] overflow-y-auto scrollbar-hide">
          <AnimatePresence>
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-4">
                  <div className="w-10 h-10 rounded-full animate-shimmer flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-24 h-3 rounded animate-shimmer" />
                    <div className="w-36 h-3 rounded animate-shimmer" />
                  </div>
                </div>
              ))
            ) : notifications?.length > 0 ? (
              notifications.map((n, idx) => {
                const { icon, bg } = getIconConfig(n.type);
                const initials = getInitials(n.sender?.name || "?");
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: idx * 0.04 }}
                    whileHover={{ backgroundColor: "rgba(239, 246, 255, 0.6)" }}
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-colors"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                        style={{ background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-secondary-500) 100%)" }}
                      >
                        {initials}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${bg} rounded-full flex items-center justify-center shadow-md ring-2 ring-white`}>
                        {icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{n.sender?.name || "Someone"}</p>
                      <p className="text-xs text-gray-400 font-medium truncate">{getMessage(n.type)}</p>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-14 px-6"
              >
                <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                  <Inbox className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="text-sm font-extrabold text-gray-700 mb-1">All caught up!</h3>
                <p className="text-xs text-gray-400 font-medium leading-relaxed max-w-[160px]">
                  We'll let you know when something new happens.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}