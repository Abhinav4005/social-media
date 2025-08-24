import { Server } from "socket.io";
import registerChatHandler from "./chat.handler.js";
import registerPresenceHandler from "./presence.handler.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New client connected", socket.id);

        registerChatHandler(io, socket);
        registerPresenceHandler(io, socket);

        socket.on("disconnect", () => {
            console.log("Client disconnected", socket.id);
        })
    });
    return io;
};

export const getIo = () => io;