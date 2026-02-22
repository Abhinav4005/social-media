import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
    transports: ["websocket"],
    reconnection: true,
    auth:{
        token: localStorage.getItem("token"),
    }
})