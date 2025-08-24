import prisma from "../config/db.js";

const registerChatHandler = (io, socket) => {
    // Implement chat event handlers here
    socket.on("joinRoom", ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
        const { text, senderId, type, roomId, attachments, replyTo } = data;

        if (!text || !senderId || !roomId || !type) {
            console.error("Missing required fields to send message");
            return;
        }
        console.log("Sending message:", { text, senderId, roomId, type, attachments, replyTo });

        const newMessage = await prisma.message.create({
            data: {
                text,
                senderId,
                roomId: parseInt(roomId),
                type,
                replyTo: replyTo ? parseInt(replyTo) : null,
                attachments: attachments ? attachments.map(url => ({
                    url,
                    mimeType: url.endsWith('.png') ||
                        url.endsWith('.jpg') || url.endsWith('.gif') ||
                        url.endsWith('.jpeg') || url.endsWith('.svg') || url.endsWith('.webp') ? 'IMAGE' :
                        url.endsWith('.mp4') ||
                            url.endsWith('.mkv') ||
                            url.endsWith('.mov') ||
                            url.endsWith('.avi') ||
                            url.endsWith('.wmv') ||
                            url.endsWith('.flv') ||
                            url.endsWith('.webm') ? 'VIDEO' :
                            url.endsWith('.mp3') ||
                                url.endsWith('.wav') ||
                                url.endsWith('.flac') ||
                                url.endsWith('.aac') ? 'AUDIO' : 'FILE'
                })) : []
            },
            include: {
                sender: true,
                attachments: true,
                reactions: true,
                readBy: true,
                repliedTo: true,
                replied: true,
            }
        });

        io.to(roomId).emit("newMessage", newMessage);

        console.log("New message sent:", newMessage);
    });

    socket.on("messageRead", async ({ messageId, userId, roomId }) => {
        if (!messageId || !userId || !roomId) {
            console.error("Missing required fields to mark message as read");
            return;
        }

        const member = await prisma.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: parseInt(roomId),
                    userId: parseInt(userId)
                }
            }
        })

        if (!member) {
            console.error(`User ${userId} is not a member of room ${roomId}`);
            return;
        }

        await prisma.messageRead.upsert({
            where: {
                messageId_userId: {
                    messageId: parseInt(messageId),
                    userId: parseInt(userId)
                }
            },
            update: {
                readAt: new Date()
            },
            create: {
                messageId: parseInt(messageId),
                userId: parseInt(userId),
                readAt: new Date()
            }
        });

        const receipt = await prisma.messageReceipt.upsert({
            where: {
                messageId_userId: {
                    messageId: parseInt(messageId),
                    userId: parseInt(userId)
                }
            },
            update: {
                readAt: new Date()
            },
            create: {
                messageId: parseInt(messageId),
                userId: parseInt(userId),
                readAt: new Date()
            }
        });
        console.log(`Message ${messageId} read by user ${userId} in room ${roomId}`);
        io.to(roomId).emit("messageRead", { 
            messageId, 
            userId,
            roomId,
            readAt: receipt.readAt
        });
    });
}

export default registerChatHandler;