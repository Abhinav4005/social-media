import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { setOnlineUsers, updateLastSeen } from "../store/slices/presenceSlice";

/**
 * Custom Hook: useSocketPresence
 * Encapsulates socket connection lifecycle, online user tracking, and incoming call signaling.
 * Fulfills Single Responsibility Principle (SRP) & Interface Segregation (ISP).
 */
export function useSocketPresence() {
    const { user } = useSelector((state) => state.auth || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pendingCall, setPendingCall] = useState(null);

    /* ── Presence connection ── */
    useEffect(() => {
        if (!user?.id) {
            if (socket.connected) socket.disconnect();
            return;
        }

        const token = localStorage.getItem("token");
        if (socket.auth?.token !== token) {
            socket.auth = { token };
            socket.disconnect().connect();
        } else if (socket.disconnected) {
            socket.connect();
        }

        const handleConnect = () => socket.emit("userOnline", user.id);
        const handleOnlineUsers = (data) => dispatch(setOnlineUsers(data));
        const handleLastSeen = (data) => dispatch(updateLastSeen(data));

        socket.on("connect", handleConnect);
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("lastSeenUpdate", handleLastSeen);

        if (socket.connected) handleConnect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("onlineUsers", handleOnlineUsers);
            socket.off("lastSeenUpdate", handleLastSeen);
            socket.emit("userOffline", user.id);
        };
    }, [user?.id, dispatch]);

    /* ── Incoming call listeners ── */
    useEffect(() => {
        if (!user?.id) return;

        const handleIncomingCall = ({ from, offer }) => {
            if (window.location.pathname.startsWith("/video-call")) return;
            setPendingCall({ from, offer });
        };

        const handleCallEnded = () => setPendingCall(null);

        socket.on("incoming-call", handleIncomingCall);
        socket.on("call-ended", handleCallEnded);

        return () => {
            socket.off("incoming-call", handleIncomingCall);
            socket.off("call-ended", handleCallEnded);
        };
    }, [user?.id]);

    const answerCall = useCallback(() => {
        if (!pendingCall) return;
        navigate("/video-call/incoming", {
            state: {
                incomingCall: pendingCall,
                targetUserId: pendingCall.from,
                targetName: `User ${pendingCall.from}`,
            },
        });
        setPendingCall(null);
    }, [pendingCall, navigate]);

    const declineCall = useCallback(() => {
        if (pendingCall) {
            socket.emit("end-call", { targetUserId: pendingCall.from });
        }
        setPendingCall(null);
    }, [pendingCall]);

    return {
        pendingCall,
        answerCall,
        declineCall,
    };
}
