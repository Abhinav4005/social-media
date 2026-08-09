import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { Video, MoreVertical, Phone } from "lucide-react";
import { formatLastSeen } from "../../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { privacyService } from "../../../services/privacy.service";
import { useToast } from "../../../context/ToastContext";
import UserAvatar from "../../../components/Common/UserAvatar";
import { ROUTES } from "../../../constant/routes";

const ChatHeaderShimmer = () => (
  <div className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800">
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse" />
      <div className="space-y-2">
        <div className="w-28 h-3.5 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
        <div className="w-20 h-2.5 rounded-lg bg-gray-100 dark:bg-slate-800 animate-pulse" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
    </div>
  </div>
);

const ChatHeader = ({ roomId, data, isLoading, isError }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, lastSeen } = useSelector((state) => state.presence);
  const { showSuccess, showError } = useToast();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  if (isLoading) return <ChatHeaderShimmer />;
  if (isError) return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="px-6 py-4 border-b border-red-100/50 dark:border-red-950/50 bg-red-50/80 dark:bg-red-950/30 backdrop-blur-xl text-sm font-semibold text-red-500"
    >
      Error loading conversation.
    </motion.div>
  );

  let room = null;
  let otherMember = null;
  let isOtherUserOnline = false;

  if (data && roomId) {
    const currentRoom = data.find((r) => r.id === parseInt(roomId));
    if (currentRoom) {
      if (currentRoom.type === "DM") {
        otherMember = currentRoom.members?.find((m) => m.user.id !== user?.id);
        if (otherMember) {
          room = {
            name: otherMember.user.name,
            profileImage: otherMember.user.profileImage,
            id: otherMember.user.id,
            type: currentRoom.type,
          };
          isOtherUserOnline = onlineUsers.some((id) => String(id) === String(otherMember.user.id));
        }
      } else {
        room = {
          name: currentRoom.name,
          profileImage: currentRoom.profileImage,
          type: currentRoom.type,
          memberCount: currentRoom.members?.length,
        };
      }
    }
  }

  if (!room) return <ChatHeaderShimmer />;

  const handleBlockUser = async () => {
    if (!otherMember?.user?.id) return;
    try {
      await privacyService.blockUser(otherMember.user.id);
      showSuccess(`Blocked ${otherMember.user.name}`);
      navigate(ROUTES.CHAT);
    } catch (err) {
      showError(err.message || "Failed to block user");
    }
  };

  const menuItems = [
    { label: "👤 View Profile", action: () => navigate(ROUTES.USER_PROFILE(otherMember?.user?.id)) },
    { label: "🔔 Mute Notifications", action: () => showSuccess("Notifications muted") },
    { label: "🚫 Block User", action: handleBlockUser, className: "text-rose-600 dark:text-rose-400 font-bold" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 transition-colors duration-200"
    >
      {/* Left — Avatar & Status */}
      <div className="flex items-center gap-3">
        <div
          className="relative flex-shrink-0 cursor-pointer"
          onClick={() => otherMember?.user?.id && navigate(ROUTES.USER_PROFILE(otherMember.user.id))}
        >
          <UserAvatar
            name={room.name}
            profileImage={room.profileImage}
            size="md"
            shape="circle"
            showOnline={isOtherUserOnline}
            animate
            ring="ring-2 ring-white dark:ring-slate-800"
          />
        </div>

        <div>
          <h3 className="text-[15px] font-black text-gray-900 dark:text-gray-100 capitalize tracking-tight leading-tight">
            {room.name}
          </h3>
          <p className="text-[12px] font-semibold mt-0.5">
            {room.type === "GROUP" ? (
              <span className="text-gray-500 dark:text-gray-400">{room.memberCount} members</span>
            ) : isOtherUserOnline ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
                />
                Active now
              </span>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                Last seen {formatLastSeen(lastSeen?.[room?.id])}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Phone className="w-[18px] h-[18px]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(ROUTES.VIDEO_CALL(roomId), { state: { targetUserId: otherMember?.user?.id, targetName: otherMember?.user?.name } })}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <Video className="w-[18px] h-[18px]" />
        </motion.button>

        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 z-50 overflow-hidden"
              >
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 ${
                      item.className || "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatHeader;
