import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { setOnlineUsers, updateLastSeen } from "./store/slices/presenceSlice";

const SocketPresence = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user?.id) return;

        const handleConnect = () => {
            socket.emit("userOnline", user?.id);
        }

        const handleOnlineUsers = (data) => {
            dispatch(setOnlineUsers(data));
        }

        const handleLastSeenUpdate = (data) => {
            dispatch(updateLastSeen(data));
        }

        socket.on("connect", handleConnect);
        socket.on("onlineUsers", handleOnlineUsers);
        socket.on("lastSeenUpdate", handleLastSeenUpdate);

        if (socket.connected) handleConnect();

        return () => {
            socket.off("connect", handleConnect);
            socket.off("onlineUsers", handleOnlineUsers);
            socket.off("lastSeenUpdate", handleLastSeenUpdate);
            socket.emit("userOffline", user?.id);
        }
    }, [user?.id, dispatch]);
    return null;
}

export default SocketPresence;