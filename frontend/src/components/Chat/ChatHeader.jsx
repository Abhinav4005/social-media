import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { socket } from "../../../socket";
import { Video, MoreVertical, Phone } from "lucide-react";
import { formatLastSeen } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ChatHeaderShimmer = () => (
  <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
      <div className="space-y-2">
        <div className="w-28 h-3.5 rounded-lg bg-gray-100 animate-pulse" />
        <div className="w-20 h-2.5 rounded-lg bg-gray-100 animate-pulse" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
      <div className="w-9 h-9 rounded-xl bg-gray-100 animate-pulse" />
    </div>
  </div>
);

const ChatHeader = ({ roomId, data, isLoading, isError }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers, lastSeen } = useSelector((state) => state.presence);
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
    <div className="px-6 py-4 border-b border-red-100 bg-red-50 text-sm font-semibold text-red-500">
      Error loading conversation.
    </div>
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

  const getInitials = (name = "") =>
    name.split(" ").map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);

  const menuItems = [
    ...(room.type === "GROUP"
      ? [
        { label: "Edit Group Info", action: () => { }, className: "text-gray-700" },
        { label: "Leave Group", action: () => { }, className: "text-red-500" },
      ]
      : []),
    { label: room.type === "DM" ? "Delete Chat" : "Delete Group", action: () => { }, className: "text-red-500" },
    { label: room.type === "DM" ? "Archive Chat" : "Archive Group", action: () => { }, className: "text-gray-700" },
    { label: "More Settings", action: () => { }, className: "text-gray-700" },
  ];

  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-gray-100 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]">
      {/* Left — avatar + info */}
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {room.profileImage ? (
            <img
              src={room.profileImage}
              alt={room.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black text-white shadow-sm"
              style={{ background: "var(--gradient-primary)" }}
            >
              {getInitials(room.name)}
            </div>
          )}
          {isOtherUserOnline && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div>
          <h3 className="text-[14px] font-black text-gray-900 capitalize tracking-tight leading-tight">
            {room.name}
          </h3>
          <p className="text-[11px] font-medium mt-0.5">
            {room.type === "GROUP" ? (
              <span className="text-gray-400">{room.memberCount} members</span>
            ) : isOtherUserOnline ? (
              <span className="text-emerald-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Active now
              </span>
            ) : (
              <span className="text-gray-400">
                Last seen {formatLastSeen(lastSeen?.[room?.id])}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
        >
          <Phone className="w-[18px] h-[18px]" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate(`/video-call/${roomId}`, { state: { targetUserId: otherMember?.user?.id, targetName: otherMember?.user?.name } })}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all cursor-pointer"
        >
          <Video className="w-[18px] h-[18px]" />
        </motion.button>

        <div className="relative" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => setIsMenuOpen((p) => !p)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-[0_20px_60px_-12px_rgba(0,0,0,0.18)] border border-gray-100 overflow-hidden z-30 py-1.5"
              >
                {menuItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => { item.action(); setIsMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold hover:bg-gray-50 transition-colors cursor-pointer ${item.className}`}
                  >
                    {item.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
