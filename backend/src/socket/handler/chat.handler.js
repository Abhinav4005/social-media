import { prisma } from "../../lib/prisma.js";
import { getIo } from "../index.js";
import { UserSocketManager } from "../manager/UserSocketManager.js";
import { createMessage } from "../services/message.service.js";

const registerChatHandler = (socket) => {
    const io = getIo();
    // Implement chat event handlers here
    socket.on("joinRoom", ({ roomId, userId }) => {
        // const userId = socket.userId;
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
        // const senderId = socket.userId;
        const { roomId } = data;

        const newMessage = await createMessage(data);

        io.to(roomId).emit("newMessage", newMessage);

        console.log("New message sent:", newMessage);
    });

    socket.on("messageReadByUser", async ({ messageId, userId, roomId }) => {
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
        io.to(roomId).emit("messageRead", {
            messageId,
            userId,
            roomId,
            readAt: readEntry.readAt
        });
    });

    socket.on("isTyping", ({ roomId, userId, isTyping }) => {
        if(!roomId || !userId ) {
            console.error("Missing required fields for isTyping");
            return;
        }

        socket.to(roomId).emit("userTyping", { 
            roomId, 
            userId, 
            isTyping 
        });
    })

    socket.on("stopTyping", ({ roomId, userId, isTyping }) => {
        if(!roomId || !userId ) {
            console.error("Missing required fields for stopTyping");
            return;
        }

        socket.to(roomId).emit("userStoppedTyping", { 
            roomId, 
            userId,
            isTyping
        });
    })

    socket.on("call-user", ({ targetUserId, offer }) => {
        const targetSocketId = UserSocketManager.getUserSockets(targetUserId);
        console.log("Calling user:", targetUserId, "at socket:", targetSocketId);
        if(targetSocketId.length === 0) {
            console.error("Target user is not online:", targetUserId);
            return;
        }

        targetSocketId.forEach(socketId => {
            io.to(socketId).emit("incoming-call", {
                from: socket.id,
                offer
            })
        })

        if(offer) {
            UserSocketManager.setUserBusy(targetUserId);
            socket.emit("set-busy", { status: "busy" });

            io.to(targetUserId).emit("set-busy", { status: "busy" });
        }
    })

    socket.on("answer-call" , ({ targetUserId, answer }) => {
        const targetSocketId = UserSocketManager.getUserSockets(targetUserId);
        console.log("Answering call to user:", targetUserId, "at socket:", targetSocketId);
        if(targetSocketId.length === 0) {
            console.error("Target user is not online:", targetUserId);
            return;
        }

        targetSocketId.forEach(socketId => {
            io.to(socketId).emit("call-answered", {
                from: socket.id,
                answer
            })
        })

        if(answer) {
            UserSocketManager.setUserBusy(targetUserId);
            socket.emit("set-busy", { status: "busy" });

            io.to(targetUserId).emit("set-busy", { status: "busy" });
        }
    })

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

export default registerChatHandler;