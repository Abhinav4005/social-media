import { getIo } from "../index.js";
import { UserSocketManager } from "../manager/UserSocketManager.js";

const registerPresenceHandler = (socket) => {

    const io = getIo();
    
    socket.on("userOnline", (userId) => {
        UserSocketManager.addUser(userId, socket.id);
        console.log(`User ${userId} is online`);
        io.emit("onlineUsers", UserSocketManager.getOnlineUserIds());
    });

    socket.on("userOffline", (userId) => {
        UserSocketManager.removeUser(userId);
        console.log(`User ${userId} is offline`);
        io.emit("onlineUsers", UserSocketManager.getOnlineUserIds());
        io.emit("lastSeenUpdate", { userId, lastSeen: new Date() });
    });

    socket.on("onlineUserCount", (roomId) => {
        const count = UserSocketManager.getOnlineUsersCount();
        io.to(roomId).emit("onlineUserCountResponse", count);

        io.emit("onlineUserCount", count);
    });

    socket.on("disconnect", () => {
        UserSocketManager.removeSocket(socket.id);
        console.log(`Socket ${socket.id} disconnected`);
        io.emit("onlineUsers", UserSocketManager.getOnlineUserIds());
    });
};

export default registerPresenceHandler;