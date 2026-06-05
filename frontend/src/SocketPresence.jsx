import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { setOnlineUsers, updateLastSeen } from "./store/slices/presenceSlice";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, PhoneOff, Video } from "lucide-react";

/* ─── Incoming call banner — shown on ANY page ─────────────── */
const IncomingCallBanner = ({ call, onAnswer, onDecline }) => (
  <motion.div
    initial={{ opacity: 0, y: -80 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -80 }}
    transition={{ type: "spring", stiffness: 320, damping: 30 }}
    className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-[340px] rounded-2xl overflow-hidden shadow-2xl"
    style={{
      background: "rgba(15,15,20,0.92)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.1)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    }}
  >
    {/* animated top bar */}
    <motion.div
      animate={{ scaleX: [0, 1] }}
      transition={{ duration: 30, ease: "linear" }}
      style={{ transformOrigin: "left", background: "linear-gradient(90deg,#22c55e,#16a34a)", height: 3, width: "100%" }}
    />

    <div className="flex items-center gap-3 px-4 py-3.5">
      {/* avatar */}
      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-black text-white text-sm"
          style={{ background: "linear-gradient(135deg,#6366f1,#4338ca)" }}
        >
          {`U${call.from}`.slice(0, 2).toUpperCase()}
        </div>
        {/* pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0f0f14] flex items-center justify-center">
          <Video className="w-2 h-2 text-white" />
        </span>
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
          Incoming video call
        </p>
        <p className="text-[14px] font-black text-white truncate">
          User {call.from}
        </p>
      </div>

      {/* action buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onDecline}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
          title="Decline"
        >
          <PhoneOff className="w-4 h-4 text-red-400" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onAnswer}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
          style={{
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
          }}
          title="Answer"
        >
          <Phone className="w-4 h-4 text-white" />
        </motion.button>
      </div>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════
   SocketPresence — always mounted, handles presence + call toasts
═══════════════════════════════════════════════════════════════ */
const SocketPresence = () => {
  const { user }  = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const [pendingCall, setPendingCall] = useState(null); // { from, offer }
  const ringtoneRef = useRef(null);

  /* ── presence ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!user?.id) return;

    const handleConnect     = () => socket.emit("userOnline", user.id);
    const handleOnlineUsers = (data) => dispatch(setOnlineUsers(data));
    const handleLastSeen    = (data) => dispatch(updateLastSeen(data));

    socket.on("connect",         handleConnect);
    socket.on("onlineUsers",     handleOnlineUsers);
    socket.on("lastSeenUpdate",  handleLastSeen);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect",        handleConnect);
      socket.off("onlineUsers",    handleOnlineUsers);
      socket.off("lastSeenUpdate", handleLastSeen);
      socket.emit("userOffline", user.id);
    };
  }, [user?.id, dispatch]);

  /* ── global incoming-call listener ───────────────────────── */
  useEffect(() => {
    if (!user?.id) return;

    const handleIncomingCall = ({ from, offer }) => {
      // If already on the video-call page, let VideoCall.jsx handle it
      if (window.location.pathname.startsWith("/video-call")) return;

      setPendingCall({ from, offer });
    };

    // If call ended while banner is up, dismiss it
    const handleCallEnded = () => setPendingCall(null);

    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-ended",    handleCallEnded);

    return () => {
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-ended",    handleCallEnded);
    };
  }, [user?.id]);

  const handleAnswer = () => {
    if (!pendingCall) return;
    // Navigate to video-call page and pass the offer + caller info via state
    navigate("/video-call/incoming", {
      state: {
        incomingCall: pendingCall,
        targetUserId: pendingCall.from,
        targetName: `User ${pendingCall.from}`,
      },
    });
    setPendingCall(null);
  };

  const handleDecline = () => {
    if (pendingCall) {
      socket.emit("end-call", { targetUserId: pendingCall.from });
    }
    setPendingCall(null);
  };

  return (
    <>
      <AnimatePresence>
        {pendingCall && (
          <IncomingCallBanner
            call={pendingCall}
            onAnswer={handleAnswer}
            onDecline={handleDecline}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SocketPresence;
