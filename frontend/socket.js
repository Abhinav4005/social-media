import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_BASE_URL, {
    transports: ["websocket"],
    reconnection: true,
    auth:{
        token: localStorage.getItem("token"),
    }
})