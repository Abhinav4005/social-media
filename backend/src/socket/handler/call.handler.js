import { getIo } from "../index.js";
import { CallService } from "../services/call.service.js";

const registerCallHandler = (socket) => {
    const io = getIo()
    const userId = socket.userId;

    socket.on("start-call", async ({ roomId }) => {
        try {
            const call = await CallService.startCall(roomId, userId)

            socket.join(`call:${call.id}`);

            io.to(roomId).emit("incoming-call", {
                callSessionId: call.id
            })
        } catch (error) {
            socket.emit("call-error", error.message);
        }
    });

    socket.on("join-call", async ({ callSessionId }) => {
        try {
            await CallService.joinCall(callSessionId, userId);

            socket.join(`call:${callSessionId}`);

            socket.to(`call:${callSessionId}`).emit("user-joined-call", {
                userId
            });
        } catch (error) {
            socket.emit("join-call-error", error.message);
        }
    });

    socket.on('leave-call', async ({ callSessionId }) => {
        try {
            await CallService.leaveCall(callSessionId, userId);

            socket.leave(`call:${callSessionId}`);

            socket.to(`call:${callSessionId}`).emit('user-left-call', {
                userId
            });
        } catch (error) {
            socket.emit('leave-call-error', error.message);
        }
    });

    socket.on('end-call', async({ callSessionId }) => {
        try {
            await CallService.endCall(callSessionId, userId);

            io.to(`call:${callSessionId}`).emit('call-ended');
        } catch (error) {
            socket.emit("end-call-error", error.message);
        }
    })
}

export default registerCallHandler;