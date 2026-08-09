import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { setOnlineUsers, updateLastSeen } from "../store/slices/presenceSlice";
import { SOCKET_EVENTS } from "../constant/socketEvents";

export function useSocketPresence() {
    const { user } = useSelector((state) => state.auth || {});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [pendingCall, setPendingCall] = useState(null);

    useEffect(() => {
        if (!user?.id) {
            if (socket.connected) socket.disconnect();
            return;
        }

        if (socket.disconnected) {
            socket.connect();
        }

        const handleConnect = () => socket.emit(SOCKET_EVENTS.USER_ONLINE, user.id);
        const handleOnlineUsers = (data) => dispatch(setOnlineUsers(data));
        const handleLastSeen = (data) => dispatch(updateLastSeen(data));

        socket.on("connect", handleConnect);
        socket.on(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
        socket.on(SOCKET_EVENTS.LAST_SEEN_UPDATE, handleLastSeen);

        if (socket.connected) handleConnect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off(SOCKET_EVENTS.ONLINE_USERS, handleOnlineUsers);
            socket.off(SOCKET_EVENTS.LAST_SEEN_UPDATE, handleLastSeen);
            socket.emit(SOCKET_EVENTS.USER_OFFLINE, user.id);
        };
    }, [user?.id, dispatch]);

    useEffect(() => {
        if (!user?.id) return;

        const handleIncomingCall = ({ from, offer }) => {
            if (window.location.pathname.startsWith("/video-call")) return;
            setPendingCall({ from, offer });
        };

        const handleCallEnded = () => setPendingCall(null);

        socket.on(SOCKET_EVENTS.INCOMING_CALL, handleIncomingCall);
        socket.on(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);

        return () => {
            socket.off(SOCKET_EVENTS.INCOMING_CALL, handleIncomingCall);
            socket.off(SOCKET_EVENTS.CALL_ENDED, handleCallEnded);
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
            socket.emit(SOCKET_EVENTS.END_CALL, { targetUserId: pendingCall.from });
        }
        setPendingCall(null);
    }, [pendingCall]);

    return {
        pendingCall,
        answerCall,
        declineCall,
    };
}
