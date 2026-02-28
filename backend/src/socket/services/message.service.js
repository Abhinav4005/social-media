import { prisma } from "../../lib/prisma.js"

export const createMessage = async (senderId, data) => {
    try {
        const { text, replyTo, attachments, type, roomId } = data;

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

export const messageRead = async (messageId, userId, roomId )=>{
    const messageIdNum = parseInt(messageId);
        const userIdNum = parseInt(userId);
        const roomIdNum = parseInt(roomId);

        if (!messageId || !userId || !roomId) {
            console.error("Missing required fields to mark message as read");
            return;
        }

        const member = await prisma.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: roomIdNum,
                    userId: userIdNum
                }
            }
        })

        if (!member) {
            console.error(`User ${userId} is not a member of room ${roomId}`);
            return;
        }

        const [readEntry, receipt] = await prisma.$transaction([
            prisma.messageRead.upsert({
                where: {
                    messageId_memberId: {
                        messageId: messageIdNum,
                        memberId: member.id,
                    },
                },
                update: {
                    readAt: new Date()
                },
                create: {
                    messageId: messageIdNum,
                    memberId: member.id,
                    readAt: new Date(),
                },
            }),

            prisma.messageReceipt.upsert({
                where: {
                    messageId_userId: {
                        messageId: messageIdNum,
                        userId: userIdNum,
                    },
                },
                update: {
                    readAt: new Date()
                },
                create: {
                    messageId: messageIdNum,
                    userId: userIdNum,
                    readAt: new Date(),
                },
            }),
        ])

        console.log(`Message ${messageId} read by user ${userId} in room ${roomId}`);
        return readEntry;
}