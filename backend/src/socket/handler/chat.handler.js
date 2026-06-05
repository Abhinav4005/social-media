import { getIo } from "../index.js";
import { createMessage, messageRead } from "../services/message.service.js";

const registerChatHandler = (socket) => {
    const io = getIo();
    socket.on("joinRoom", ({ roomId }) => {
        const userId = socket.userId;
        // Join both string and integer versions so emit always reaches the room
        socket.join(String(roomId));
        socket.join(parseInt(roomId));
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
        const senderId = socket.userId;
        const { roomId } = data;

        try {
            const newMessage = await createMessage(senderId, data);

            if (!newMessage) {
                socket.emit("messageError", { error: "Invalid message data" });
                return;
            }

            // Emit to string and number versions of roomId to avoid type mismatch
            io.to(String(roomId)).emit("newMessage", newMessage);
            io.to(parseInt(roomId)).emit("newMessage", newMessage);

            console.log("New message sent:", newMessage.id);
        } catch (err) {
            console.error("sendMessage error:", err);
            socket.emit("messageError", { error: err.message });
        }
    });

    socket.on("messageReadByUser", async ({ messageId, userId, roomId }) => {
        const readMessage = messageRead(messageId, userId, roomId);
        io.to(roomId).emit("messageRead", {
            messageId,
            userId,
            roomId,
            readAt: readMessage.readAt
        });
    });
}

export default registerChatHandler;