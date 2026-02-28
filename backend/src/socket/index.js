import { Server } from "socket.io";
import registerChatHandler from "./handler/chat.handler.js";
import registerPresenceHandler from "./handler/presence.handler.js";
import registerSignalHandler from "./handler/signaling.handler.js";
import socketAuthMiddleware from "./middleware/auth.middleware.js";
import registerCallHandler from "./handler/call.handler.js";
import { UserSocketManager } from "./manager/UserSocketManager.js";
import registerTypingHandler from "./handler/typing.handler.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [process.env.FRONTEND_BASE_URL, /https:\/\/.*\.ngrok-free\.app/],
            methods: ['GET', "POST"],
            credentials: true
        }
    });

    io.use(socketAuthMiddleware);

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);
        const userId = socket.userId;
        UserSocketManager.addUser(userId, socket.id);

        registerChatHandler(socket);
        registerPresenceHandler(socket);
        registerSignalHandler(socket);
        registerCallHandler(socket);
        registerTypingHandler(socket);

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        })
    });
    return io;
};

export const getIo = () => io;