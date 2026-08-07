import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    auth: (cb) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
        cb({ token });
    }
});
