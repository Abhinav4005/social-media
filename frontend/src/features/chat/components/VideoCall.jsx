import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Phone,
  Volume2, VolumeX, ArrowLeft, FlipHorizontal,
} from "lucide-react";
import { useMediaStream } from "../../../hooks/useMediaStream";
import { useWebRTC } from "../../../hooks/useWebRTC";

const Btn = ({ onClick, disabled, children, className = "", style, title }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    title={title}
    whileHover={!disabled ? { scale: 1.07 } : {}}
    whileTap={!disabled ? { scale: 0.93 } : {}}
    transition={{ type: "spring", stiffness: 380, damping: 22 }}
    className={`select-none cursor-pointer disabled:cursor-not-allowed ${className}`}
    style={style}
  >
    {children}
  </motion.button>
);

const PulseRings = ({ color = "#6366f1" }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    {[1, 1.45, 1.85].map((scale, i) => (
      <motion.span
        key={i}
        className="absolute rounded-full border"
        style={{ width: 96, height: 96, borderColor: color, opacity: 0 }}
        animate={{ scale: [1, scale], opacity: [0.55, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
      />
    ))}
  </div>
);

const EqBars = () => (
  <div className="flex items-end gap-[3px] h-[18px]">
    {[0.55, 1, 0.7, 0.85, 0.45].map((h, i) => (
      <motion.span
        key={i}
        className="w-[3px] rounded-full bg-emerald-400"
        animate={{ scaleY: [h, 1, h * 0.35, 1, h] }}
        transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.12 }}
        style={{ height: "100%", transformOrigin: "bottom" }}
      />
    ))}
  </div>
);

const Avatar = ({ name = "?", size = "lg" }) => {
  const initials = name.split(" ").map((n) => n[0]?.toUpperCase()).join("").slice(0, 2);
  const dim =
    size === "lg" ? "w-28 h-28 text-4xl"
      : size === "md" ? "w-16 h-16 text-xl"
        : "w-11 h-11 text-sm";
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-black text-white shadow-2xl select-none flex-shrink-0`}
      style={{ background: "var(--gradient-primary)" }}
    >
      {initials}
    </div>
  );
};

const ControlBtn = ({ onClick, disabled, icon, label, active }) => (
  <motion.button
    onClick={onClick}
    disabled={disabled}
    whileHover={!disabled ? { scale: 1.07 } : {}}
    whileTap={!disabled ? { scale: 0.93 } : {}}
    className="flex flex-col items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
  >
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-colors"
      style={{
        background: active ? "rgba(255,255,255,0.1)" : "rgba(239,68,68,0.2)",
        border: active ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(239,68,68,0.3)",
        color: active ? "rgba(255,255,255,0.85)" : "#f87171",
      }}
    >
      {icon}
    </div>
    <span className="text-[10px] text-gray-500 font-semibold">{label}</span>
  </motion.button>
);

const VideoCall = (props) => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const [swapped, setSwapped] = useState(false);

  const targetUserId = props.targetUserId || location.state?.targetUserId;
  const targetName = location.state?.targetName || (targetUserId ? `User ${targetUserId}` : "Unknown");
  const preloadedCall = location.state?.incomingCall || null;

  const {
    myVideo,
    streamRef,
    hasCamera,
    cameraError,
    micOn,
    camOn,
    toggleMic,
    toggleCam,
  } = useMediaStream();

  const {
    userVideo,
    incomingCall,
    callAccepted,
    callEnded,
    calling,
    speakerOn,
    duration,
    callUser,
    answerCall,
    endCall,
    toggleSpeaker,
  } = useWebRTC({ streamRef, myVideo, targetUserId, preloadedCall });

  useEffect(() => {
    if (hasCamera && targetUserId && !incomingCall && !calling && !callAccepted && !callEnded) {
      callUser(targetUserId);
    }
  }, [hasCamera, targetUserId, incomingCall, calling, callAccepted, callEnded, callUser]);

  const flipVideos = useCallback(() => setSwapped((s) => !s), []);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-40 overflow-hidden" style={{ background: "#0a0a0f" }}>

      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.12] blur-[120px]"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full opacity-[0.08] blur-[100px]"
          style={{ background: "radial-gradient(circle, #14b8a6 0%, transparent 70%)" }} />
      </div>

      <AnimatePresence>
        {callEnded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5"
            style={{ background: "rgba(10,10,15,0.96)" }}
          >
            <motion.div
              initial={{ scale: 0.7 }} animate={{ scale: 1 }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <PhoneOff className="w-9 h-9 text-red-400" />
            </motion.div>
            <div className="text-center">
              <p className="text-2xl font-black text-white tracking-tight">Call Ended</p>
              {duration > 0 && (
                <p className="text-sm text-gray-500 mt-1 tabular-nums">Duration: {fmt(duration)}</p>
              )}
            </div>
            <div className="flex gap-3 mt-2">
              <Btn
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-colors"
              >
                Go Back
              </Btn>
              <Btn
                onClick={() => { setCallEnded(false); setDuration(0); }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: "var(--gradient-primary)" }}
              >
                Call Again
              </Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ INCOMING CALL OVERLAY ═════════════════════════════ */}
      <AnimatePresence>
        {incomingCall && !callAccepted && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center"
            style={{ background: "rgba(10,10,15,0.88)", backdropFilter: "blur(20px)" }}
          >
            <motion.div
              initial={{ y: 40, scale: 0.95 }} animate={{ y: 0, scale: 1 }}
              className="flex flex-col items-center gap-6 px-12 py-10 rounded-3xl"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.6)"
              }}
            >
              <div className="relative flex items-center justify-center w-28 h-28">
                <PulseRings color="#22c55e" />
                <Avatar name={`User ${incomingCall.from}`} size="lg" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">
                  Incoming video call
                </p>
                <p className="text-2xl font-black text-white tracking-tight">
                  User {incomingCall.from}
                </p>
              </div>
              <div className="flex gap-10">
                <div className="flex flex-col items-center gap-2">
                  <Btn
                    onClick={() => setIncomingCall(null)}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.35)" }}
                  >
                    <PhoneOff className="w-6 h-6 text-red-400" />
                  </Btn>
                  <span className="text-xs text-gray-500 font-semibold">Decline</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Btn
                    onClick={answerCall}
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      boxShadow: "0 8px 24px rgba(34,197,94,0.35)"
                    }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </Btn>
                  <span className="text-xs text-gray-500 font-semibold">Answer</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ TOP HEADER ════════════════════════════════════════ */}
      {!callEnded && (
        <div
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(to bottom, rgba(10,10,15,0.85) 0%, transparent 100%)" }}
        >
          <Btn
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <ArrowLeft className="w-4 h-4" />
          </Btn>

          <div className="text-center">
            <p className="text-[13px] font-black text-white tracking-tight capitalize leading-tight">
              {targetName}
            </p>
            <p className="text-[11px] font-semibold mt-0.5">
              {callAccepted ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  {fmt(duration)}
                </span>
              ) : calling ? (
                <span className="text-yellow-400">Calling…</span>
              ) : (
                <span className="text-gray-500">Video call</span>
              )}
            </p>
          </div>

          <Btn
            onClick={flipVideos}
            title="Swap camera views"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <FlipHorizontal className="w-4 h-4" />
          </Btn>
        </div>
      )}

      {/* ════ VIDEO AREA ════════════════════════════════════════ */}
      <div className="absolute inset-0">
        <video
          ref={swapped ? myVideo : userVideo}
          autoPlay
          muted={swapped}
          playsInline
          className={`w-full h-full object-cover transition-opacity duration-500
            ${(swapped ? hasCamera : callAccepted) ? "opacity-100" : "opacity-0"}`}
        />

        <AnimatePresence>
          {!callAccepted && !callEnded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-5"
            >
              <div className="relative flex items-center justify-center w-36 h-36">
                {calling && <PulseRings color="#6366f1" />}
                <div className="relative z-10">
                  <Avatar name={targetName} size="lg" />
                  <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-[3px] border-[#0a0a0f]" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black text-white capitalize tracking-tight">{targetName}</p>
                <p className="text-sm font-semibold mt-1">
                  {cameraError
                    ? <span className="text-red-400">Camera / mic unavailable</span>
                    : calling
                      ? <span className="text-indigo-400">Ringing…</span>
                      : hasCamera
                        ? <span className="text-gray-400">Ready to call</span>
                        : <span className="text-gray-500">Initialising…</span>}
                </p>
              </div>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-72 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />
            </motion.div>
          )}
        </AnimatePresence>

        {callAccepted && (
          <div
            className="absolute top-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <EqBars />
            <span className="text-xs font-bold text-white tabular-nums ml-1">{fmt(duration)}</span>
          </div>
        )}

        <motion.div
          drag dragMomentum={false}
          className="absolute bottom-28 right-4 z-20 cursor-grab active:cursor-grabbing"
          style={{ width: 140, height: 100 }}
        >
          <div
            className="w-full h-full rounded-2xl overflow-hidden relative"
            style={{
              border: "1.5px solid rgba(255,255,255,0.18)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)",
            }}
          >
            <video
              ref={swapped ? userVideo : myVideo}
              autoPlay
              muted={!swapped}
              playsInline
              className={`w-full h-full object-cover transition-opacity duration-300
                ${(!swapped ? (camOn && hasCamera) : callAccepted) ? "opacity-100" : "opacity-0"}`}
            />
            {!swapped && !camOn && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: "rgba(20,20,28,0.95)" }}>
                <Avatar name={user?.name || "Me"} size="sm" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white/60 tracking-wide">
              {swapped ? targetName : "You"}
            </div>
            {!swapped && !micOn && (
              <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-red-500/90 flex items-center justify-center">
                <MicOff className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)" }} />
      </div>

      {/* ════ CONTROL BAR ═══════════════════════════════════════ */}
      {!callEnded && (
        <div
          className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center pb-8 pt-4 px-6"
          style={{ background: "linear-gradient(to top, rgba(10,10,15,0.92) 0%, transparent 100%)" }}
        >
          <div className="flex items-center gap-4">
            <ControlBtn
              active={micOn}
              onClick={toggleMic}
              disabled={!hasCamera}
              icon={micOn ? <Mic className="w-[18px] h-[18px]" /> : <MicOff className="w-[18px] h-[18px]" />}
              label={micOn ? "Mute" : "Unmute"}
            />

            <ControlBtn
              active={camOn}
              onClick={toggleCam}
              disabled={!hasCamera}
              icon={camOn ? <Video className="w-[18px] h-[18px]" /> : <VideoOff className="w-[18px] h-[18px]" />}
              label={camOn ? "Camera" : "No cam"}
            />

            {callAccepted ? (
              <Btn
                onClick={() => endCall(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 8px 32px rgba(239,68,68,0.45), 0 0 0 6px rgba(239,68,68,0.12)"
                  }}
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">End</span>
              </Btn>
            ) : calling ? (
              <Btn
                onClick={() => endCall(true)}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 8px 32px rgba(239,68,68,0.45), 0 0 0 6px rgba(239,68,68,0.12)"
                  }}
                >
                  <PhoneOff className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Cancel</span>
              </Btn>
            ) : (
              <Btn
                onClick={() => callUser(targetUserId)}
                disabled={!hasCamera || !targetUserId}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    boxShadow: "0 8px 32px rgba(34,197,94,0.45), 0 0 0 6px rgba(34,197,94,0.12)"
                  }}
                >
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold">Call</span>
              </Btn>
            )}

            <ControlBtn
              active={speakerOn}
              onClick={() => setSpeakerOn((s) => !s)}
              icon={speakerOn ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
              label={speakerOn ? "Speaker" : "Muted"}
            />

            <ControlBtn
              active={true}
              onClick={flipVideos}
              icon={<FlipHorizontal className="w-[18px] h-[18px]" />}
              label="Flip"
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {cameraError && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap"
            style={{ background: "rgba(239,68,68,0.85)", backdropFilter: "blur(8px)" }}
          >
            Camera / mic access denied
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCall;
