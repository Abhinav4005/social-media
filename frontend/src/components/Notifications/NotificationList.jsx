import { Bell, ThumbsUp, MessageCircle, UserPlus, Inbox } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "../../pages/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationList({ notifications, isLoading, isError }) {
  console.log("Notifications:", notifications);
  const location = useLocation();

  const getIcon = (type) => {
    switch (type) {
      case "LIKE":
        return <ThumbsUp className="w-5 h-5 text-blue-500" />;
      case "COMMENT":
        return <MessageCircle className="w-5 h-5 text-green-500" />;
      case "FOLLOW":
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    hover: { scale: 1.03 },
  };

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <div className="space-y-3 mt-4">
        <AnimatePresence>
          {notifications?.length > 0 ? (
            notifications.map((n) => (
              <motion.div
                key={n.id}
                className="w-md flex m-auto items-center mb-4 gap-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-3 cursor-pointer"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                whileHover="hover"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700">
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {n.sender?.name || "Someone"}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {n.type === "LIKE"
                      ? "reacted to your post"
                      : n.type === "COMMENT"
                      ? "commented on your post"
                      : n.type === "FOLLOW"
                      ? "started following you"
                      : `sent a ${n.type}`}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                No Notifications Yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">
                You’re all caught up! We’ll let you know when something new happens.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}