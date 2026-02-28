import { getIo } from "../index.js";
import { UserSocketManager } from "../manager/UserSocketManager.js";

const registerCallHandler = (socket) => {
    const io = getIo()
    socket.on("call-user", ({ targetUserId, offer }) => {
        const targetSocketId = UserSocketManager.getUserSockets(targetUserId);
        console.log("Calling user:", targetUserId, "at socket:", targetSocketId);
        if (targetSocketId.length === 0) {
            console.error("Target user is not online:", targetUserId);
            return;
        }

        targetSocketId.forEach(socketId => {
            io.to(socketId).emit("incoming-call", {
                from: socket.id,
                offer
            })
        })

        if (offer) {
            UserSocketManager.setUserBusy(targetUserId);
            socket.emit("set-busy", { status: "busy" });

            const sockets = UserSocketManager.getUserSockets(targetUserId);
            sockets.forEach(id => io.to(id).emit("set-busy", { status: "busy" }))
        }
    })

    socket.on("answer-call", ({ targetUserId, answer }) => {
        const targetSocketId = UserSocketManager.getUserSockets(targetUserId);
        console.log("Answering call to user:", targetUserId, "at socket:", targetSocketId);
        if (targetSocketId.length === 0) {
            console.error("Target user is not online:", targetUserId);
            return;
        }

        targetSocketId.forEach(socketId => {
            io.to(socketId).emit("call-answered", {
                from: socket.id,
                answer
            })
        })

        if (answer) {
            UserSocketManager.setUserBusy(targetUserId);
            socket.emit("set-busy", { status: "busy" });

            io.to(targetUserId).emit("set-busy", { status: "busy" });
        }
    })
}

export default registerCallHandler;