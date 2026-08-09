import { Bell, Heart, MessageCircle, UserPlus, Inbox, Check, MoreHorizontal } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Navbar from "../../../pages/Navbar";
import { formatLastSeen } from "../../../utils/formatTime";

const TYPE_CONFIG = {
  LIKE: {
    icon: Heart,
    label: "reacted to your post",
    color: "#f43f5e",
    bg: "#fff1f2",
    darkBg: "rgba(244,63,94,0.12)",
  },
  COMMENT: {
    icon: MessageCircle,
    label: "commented on your post",
    color: "#6366f1",
    bg: "#eef2ff",
    darkBg: "rgba(99,102,241,0.12)",
  },
  FOLLOW: {
    icon: UserPlus,
    label: "started following you",
    color: "#10b981",
    bg: "#f0fdf4",
    darkBg: "rgba(16,185,129,0.12)",
  },
  REPLY: {
    icon: MessageCircle,
    label: "replied to your comment",
    color: "#8b5cf6",
    bg: "#f5f3ff",
    darkBg: "rgba(139,92,246,0.12)",
  },
  default: {
    icon: Bell,
    label: "sent you a notification",
    color: "#6b7280",
    bg: "#f9fafb",
    darkBg: "rgba(107,114,128,0.12)",
  },
};

const getConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.default;

const GRADIENTS = [
  ["#6366f1", "#8b5cf6"],
  ["#ec4899", "#f43f5e"],
  ["#f59e0b", "#f97316"],
  ["#10b981", "#14b8a6"],
  ["#3b82f6", "#6366f1"],
  ["#a855f7", "#ec4899"],
];
function getGradient(name = "") {
  const code = [...(name || "?")].reduce((a, c) => a + c.charCodeAt(0), 0);
  return GRADIENTS[code % GRADIENTS.length];
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const itemVariants = {
  hidden: { opacity: 0, x: -14, scale: 0.97 },
  show: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } },
};

const FILTERS = ["All", "Likes", "Comments", "Follows"];
const FILTER_TYPES = { Likes: "LIKE", Comments: "COMMENT", Follows: "FOLLOW" };

function NotificationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="w-10 h-10 rounded-full animate-shimmer flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-36 rounded animate-shimmer" />
        <div className="h-2.5 w-52 rounded animate-shimmer" />
      </div>
      <div className="h-2.5 w-10 rounded animate-shimmer" />
    </div>
  );
}

function NotificationItem({ notification, isPage }) {
  const cfg = getConfig(notification.type);
  const Icon = cfg.icon;
  const [c1, c2] = getGradient(notification.sender?.name);
  const initials = (notification.sender?.name || "?").slice(0, 2).toUpperCase();
  const timeAgo = formatLastSeen(notification.createdAt);
  const isUnread = !notification.isRead;

  return (
    <motion.div
      variants={itemVariants}
      className={`group relative flex items-center gap-3.5 px-5 py-3.5 cursor-pointer transition-colors duration-150
        hover:bg-gray-50 dark:hover:bg-slate-800/60
        ${isUnread ? "bg-primary-50/40 dark:bg-primary-900/10" : ""}
        ${isPage ? "" : "border-b border-gray-50/70 dark:border-slate-800/70 last:border-0"}
      `}
    >
      {isUnread && (
        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary-500 flex-shrink-0" />
      )}

      <div className="relative flex-shrink-0">
        {notification.sender?.profileImage ? (
          <img
            src={notification.sender.profileImage}
            alt={notification.sender.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-sm"
          />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-white dark:ring-slate-900 shadow-sm"
            style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
          >
            {initials}
          </div>
        )}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
          className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-sm"
          style={{ backgroundColor: cfg.color }}
        >
          <Icon className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] leading-snug text-gray-800 dark:text-gray-100">
          <span className="font-bold">{notification.sender?.name || "Someone"}</span>{" "}
          <span className="text-gray-500 dark:text-gray-400 font-normal">{cfg.label}</span>
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-medium">{timeAgo}</p>
      </div>

      {isPage && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 flex-shrink-0"
        >
          <MoreHorizontal className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </motion.div>
  );
}

export default function NotificationList({ notifications, isLoading, isError }) {
  const location = useLocation();
  const isPage = location.pathname === "/notifications";
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? notifications
      : notifications?.filter((n) => n.type === FILTER_TYPES[activeFilter]);

  if (!isPage) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="app-surface sticky top-[80px] overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-100 dark:border-slate-800 transition-colors duration-200"
      >
        <header className="flex items-center justify-between border-b border-gray-100/50 dark:border-slate-800 px-5 py-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">Activity</p>
            <h2 className="font-heading text-[15px] font-bold text-gray-950 dark:text-gray-100 leading-tight">Notifications</h2>
          </div>
          <div className="relative">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md shadow-primary-200/50 dark:shadow-primary-900/30">
              <Bell className="w-4 h-4 text-white" />
            </div>
            {notifications?.some(n => !n.isRead) && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900" />
            )}
          </div>
        </header>

        <div className="max-h-[480px] overflow-y-auto scrollbar-hide">
          {isLoading ? (
            <div className="divide-y divide-gray-50 dark:divide-slate-800">
              {[1, 2, 3].map(i => <NotificationSkeleton key={i} />)}
            </div>
          ) : filtered?.length > 0 ? (
            <motion.div variants={listVariants} initial="hidden" animate="show">
              {filtered.map(n => <NotificationItem key={n.id} notification={n} isPage={false} />)}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Inbox className="w-5 h-5 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">All caught up</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">No new notifications</p>
            </motion.div>
          )}
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-[#0b0f19] pt-6 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-5">

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
            className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-600 animate-gradient-x" />

            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg shadow-primary-300/40 dark:shadow-primary-900/30">
                  <Bell className="w-5 h-5 text-white" />
                  <span className="absolute inset-0 rounded-2xl ring-2 ring-primary-300/30 dark:ring-primary-600/20 animate-pulse pointer-events-none" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Notifications</h1>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={notifications?.length}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="text-[12px] font-medium text-gray-400 dark:text-gray-500 mt-0.5"
                    >
                      {isLoading ? "Loading…" : `${notifications?.length ?? 0} total · ${notifications?.filter(n => !n.isRead)?.length ?? 0} unread`}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </motion.button>
            </div>

            <div className="flex items-center gap-1 px-6 pb-4 overflow-x-auto scrollbar-hide">
              {FILTERS.map((f) => (
                <motion.button
                  key={f}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(f)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    activeFilter === f
                      ? "text-primary-700 dark:text-primary-300"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {activeFilter === f && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 bg-primary-100 dark:bg-primary-900/40 rounded-xl"
                    />
                  )}
                  <span className="relative">{f}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 24 }}
            className="bg-white dark:bg-slate-900 rounded-[24px] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden"
          >
            {isLoading ? (
              <div className="divide-y divide-gray-50/80 dark:divide-slate-800/80">
                {[1, 2, 3, 4, 5].map(i => <NotificationSkeleton key={i} />)}
              </div>
            ) : isError ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center px-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-rose-400" />
                </div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Failed to load notifications</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Please check your connection and try again.</p>
              </motion.div>
            ) : filtered?.length > 0 ? (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="divide-y divide-gray-50/80 dark:divide-slate-800/80"
              >
                {filtered.map(n => (
                  <NotificationItem key={n.id} notification={n} isPage />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col items-center justify-center py-20 text-center px-6"
              >
                <div className="relative w-16 h-16 mb-5">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30" />
                  <div className="relative flex items-center justify-center w-full h-full">
                    <Inbox className="w-7 h-7 text-primary-400 dark:text-primary-500" />
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">All caught up!</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-xs">
                  {activeFilter === "All"
                    ? "We'll let you know when something new happens."
                    : `No ${activeFilter.toLowerCase()} notifications yet.`}
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
