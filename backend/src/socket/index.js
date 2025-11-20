import { Server } from "socket.io";
import registerChatHandler from "./handler/chat.handler.js";
import registerPresenceHandler from "./handler/presence.handler.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["http://localhost:5173", /https:\/\/.*\.ngrok-free\.app/],
            methods: ['GET', "POST"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        registerChatHandler(socket);
        registerPresenceHandler(socket);

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        })
    });
    return io;
};

export const getIo = () => io;