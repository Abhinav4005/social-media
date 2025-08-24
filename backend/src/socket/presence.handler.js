const onlineUsers = new Map();

const registerPresenceHandler = (io, socket) => {
    socket.on("userOnline", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online`);
        io.emit("updatedOnlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("userOffline", (userId) => {
        onlineUsers.delete(userId);
        console.log(`User ${userId} is offline`);
        io.emit("updatedOnlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
        for(const [userId, socketId] of onlineUsers.entries()) {
            if(socketId === socket.id){
                onlineUsers.delete(userId)
                console.log(`User ${userId} disconnected`);
                io.emit("updateOnlineUsers", Array.from(onlineUsers.keys()));
                break;
            }
        }
    })
}
export default registerPresenceHandler;