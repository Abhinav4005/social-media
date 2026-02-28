import { getIo } from "../index.js";
import { createMessage, messageRead } from "../services/message.service.js";

const registerChatHandler = (socket) => {
    const io = getIo();
    socket.on("joinRoom", ({ roomId }) => {
        const userId = socket.userId;
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
        const senderId = socket.userId;
        const { roomId } = data;

        const newMessage = await createMessage(senderId, data);

        io.to(roomId).emit("newMessage", newMessage);

        console.log("New message sent:", newMessage);
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