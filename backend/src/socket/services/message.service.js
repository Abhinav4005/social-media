import { defaultChatRepository } from "../../repositories/chat.repository.js";

export const createMessage = async (senderId, data, chatRepository = defaultChatRepository) => {
    try {
        const { text, attachments, type, roomId } = data;

        const isTextMissing = !text || text.trim() === "";
        const hasAttachments = attachments && attachments.length > 0;

        if ((isTextMissing && !hasAttachments) || !senderId || !roomId || !type) {
            console.error("Missing required fields to send message:", {
                textMissing: isTextMissing,
                noAttachments: !hasAttachments,
                senderId,
                roomId,
                type
            });
            return;
        }

        return await chatRepository.createSocketMessage(senderId, data);
    } catch (error) {
        console.error("Failed to create new message: ", error);
        throw new Error(`Failed to create new message: ${error}`);
    }
};

export const messageRead = async (messageId, userId, roomId, chatRepository = defaultChatRepository) => {
    if (!messageId || !userId || !roomId) {
        console.error("Missing required fields to mark message as read");
        return;
    }

    const readEntry = await chatRepository.markMessageRead(messageId, userId, roomId);
    if (readEntry) {
        console.log(`Message ${messageId} read by user ${userId} in room ${roomId}`);
    }
    return readEntry;
};