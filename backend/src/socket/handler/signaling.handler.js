import { getIo } from "../index.js";

const registerSignalHandler = (socket) => {
    const io = getIo()
    socket.on("ice-candidate", ({ targetUserId, candidate }) => {
        const targetSockets = UserSocketManager.getUserSockets(targetUserId);
        console.log("Sending ICE candidate to user:", targetUserId, "at sockets:", targetSockets);
        targetSockets.forEach(socketId => {
            io.to(socketId).emit("ice-candidate", {
                from: socket.id,
                candidate
            })
        })
    })
}

export default registerSignalHandler;