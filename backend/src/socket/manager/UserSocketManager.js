const onlineUsers = new Map();
const lastSeen = new Map();
const status = new Map();

export const UserSocketManager = {
    addUser(userId, socketId) {
        const sockets = onlineUsers.get(userId) || [];
        if(!sockets.includes(socketId)) {
            sockets.push(socketId);
            onlineUsers.set(userId, sockets);
            status.set(userId, "online");
        }
        console.log(`User ${userId} connected with socket ${socketId}`);
    },

    removeSocket(socketId) {
        for (const [userId, sockets] of onlineUsers.entries()) {
            const updated = sockets.filter(id => id !== socketId);
            if (updated.length > 0) {
                onlineUsers.set(userId, updated);
            } else {
                onlineUsers.delete(userId);
                lastSeen.set(userId, new Date());
                status.set(userId, "offline");
                console.log(`User ${userId} disconnected from socket ${socketId}`);
            }
        }
    },

    removeUser(userId) {
        onlineUsers.delete(userId);
        lastSeen.set(userId, new Date());
        status.set(userId, "offline");
        console.log(`User ${userId} removed from online users`);
    },

    getUserSockets(userId) {
        return onlineUsers.get(userId) || [];
    },

    getUserStatus(userId) {
        return status.get(userId) || "offline";
    },

    getOnlineUserIds(){
        return Array.from(onlineUsers.keys());
    },

    getLastSeen(userId) {
        return lastSeen.get(userId) || null;
    },

    getOnlineUsersCount() {
        return onlineUsers.size;
    },

    setUserBusy(userId) {
        if(onlineUsers.has(userId)) {
            status.set(userId, "busy");
            console.log(`User ${userId} is now busy`);
        }
    },

    setUserAway(userId) {
        if(onlineUsers.has(userId)) {
            status.set(userId, "away");
            console.log(`User ${userId} is now away`);
        }
    },

    setUserAwayFromKeyboard(userId) {
        if(onlineUsers.has(userId)) {
            status.set(userId, "afk");
            console.log(`User ${userId} is now away from keyboard`);
        }
    },
}