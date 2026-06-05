import { getIo } from "../index.js";
import { UserSocketManager } from "../manager/UserSocketManager.js";

const registerSignalHandler = (socket) => {
    const io = getIo();
    const userId = socket.userId;

    // ── WebRTC: caller sends offer to callee ──────────────────
    socket.on("call-user", ({ targetUserId, offer }) => {
        const targetSockets = UserSocketManager.getUserSockets(targetUserId);
        if (!targetSockets.length) {
            socket.emit("call-error", "User is offline");
            return;
        }
        targetSockets.forEach(socketId => {
            io.to(socketId).emit("incoming-call", {
                from: userId,
                offer
            });
        });
    });

    // ── WebRTC: callee sends answer back to caller ────────────
    socket.on("accept-call", ({ targetUserId, answer }) => {
        const targetSockets = UserSocketManager.getUserSockets(targetUserId);
        targetSockets.forEach(socketId => {
            io.to(socketId).emit("call-accepted", {
                answer
            });
        });
    });

    // ── WebRTC: either side hangs up ──────────────────────────
    socket.on("end-call", ({ targetUserId }) => {
        const targetSockets = UserSocketManager.getUserSockets(targetUserId);
        targetSockets.forEach(socketId => {
            io.to(socketId).emit("call-ended");
        });
    });

    // ── ICE candidates (trickle ICE, if needed in future) ─────
    socket.on("ice-candidate", ({ targetUserId, candidate }) => {
        const targetSockets = UserSocketManager.getUserSockets(targetUserId);
        targetSockets.forEach(socketId => {
            io.to(socketId).emit("ice-candidate", {
                from: userId,
                candidate
            });
        });
    });
};

export default registerSignalHandler;