import { prisma } from "../../lib/prisma.js"

export const createMessage = async (data) => {
    try {
        const { text, senderId, replyTo, attachments, type, roomId } = data;

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

        const newMessage = await prisma.message.create({
            data: {
                text,
                senderId,
                roomId: parseInt(roomId),
                replyTo: replyTo ? parseInt(replyTo) : null,
                attachments: attachments && attachments.length > 0
                    ? {
                        create: attachments.map(file => ({
                            url: file.url,
                            fileId: file.fileId,
                            mimeType: file.url.endsWith('.png') ||
                                file.url.endsWith('.jpg') || file.url.endsWith('.gif') ||
                                file.url.endsWith('.jpeg') || file.url.endsWith('.svg') || file.url.endsWith('.webp') ? 'IMAGE' :
                                file.url.endsWith('.mp4') ||
                                    file.url.endsWith('.mkv') ||
                                    file.url.endsWith('.mov') ||
                                    file.url.endsWith('.avi') ||
                                    file.url.endsWith('.wmv') ||
                                    file.url.endsWith('.flv') ||
                                    file.url.endsWith('.webm') ? 'VIDEO' :
                                    file.url.endsWith('.mp3') ||
                                        file.url.endsWith('.wav') ||
                                        file.url.endsWith('.flac') ||
                                        file.url.endsWith('.aac') ? 'AUDIO' : 'FILE'
                        }))
                    }
                    : undefined,
            },
            include: {
                sender: true,
                attachments: true,
                reactions: true,
                readBy: true,
                repliedTo: true,
                replies: true
            }
            })
        return newMessage;
    } catch (error) {
        console.error("Failed to create new message: ", error);
        throw new Error(`Failed to create new message:  ${error}`)
    }
}