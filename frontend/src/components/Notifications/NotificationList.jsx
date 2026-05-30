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

      <div className="sticky top-24 overflow-hidden rounded-3xl border border-white/80 bg-white/86 shadow-[0_24px_70px_-45px_rgba(15,23,42,0.45)] backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50">
              <Bell className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">Activity</p>
              <h2 className="text-sm font-extrabold tracking-tight text-gray-900">Notifications</h2>
            </div>
          </div>
          {notifications?.length > 0 && (
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-full uppercase tracking-wider">
              {notifications.length} new
            </span>
          )}
        </div>

        {/* List */}
        <div className="max-h-[520px] divide-y divide-gray-100 overflow-y-auto scrollbar-hide">
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
                className="flex flex-col items-center justify-center px-6 py-14 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-3xl border border-gray-100 bg-gray-50">
                  <Inbox className="w-7 h-7 text-gray-300" />
                </div>
                <h3 className="mb-1 text-sm font-extrabold text-gray-800">All caught up</h3>
                <p className="max-w-[170px] text-xs font-semibold leading-relaxed text-gray-400">
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
