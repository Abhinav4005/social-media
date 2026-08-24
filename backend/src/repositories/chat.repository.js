import { prisma } from "../lib/prisma.js";

/**
 * Chat Repository handling database queries for Rooms, Members, and Messages.
 * Fulfills SRP & DIP.
 */
export class ChatRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findExistingDMRoom(dmKey) {
        return await this.db.room.findFirst({
            where: { dmKey, type: "DM" },
            include: { members: true }
        });
    }

    async createDMRoom(name, dmKey, userId, otherId) {
        return await this.db.room.create({
            data: {
                name,
                type: "DM",
                dmKey,
                members: {
                    create: [
                        { userId },
                        { userId: parseInt(otherId, 10) }
                    ]
                }
            }
        });
    }

    async createGroupRoom(name, type, userId, memberIds) {
        return await this.db.room.create({
            data: {
                name,
                type,
                members: {
                    create: [
                        { userId, role: "ADMIN" },
                        ...memberIds.map(id => ({ userId: parseInt(id, 10) }))
                    ]
                }
            }
        });
    }

    async getUserRooms(userId) {
        return await this.db.room.findMany({
            where: {
                members: { some: { userId } }
            },
            include: {
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, profileImage: true } }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: { id: true, text: true, attachments: true, createdAt: true, senderId: true }
                }
            }
        });
    }

    async getRoomMessages(roomId) {
        return await this.db.message.findMany({
            where: { roomId: parseInt(roomId, 10), isDeleted: false },
            include: {
                sender: { select: { id: true, name: true, profileImage: true } },
                attachments: true,
                reactions: true,
            },
            orderBy: { createdAt: 'asc' }
        });
    }

    async addMemberToRoom(roomId, memberId, role = "MEMBER") {
        return await this.db.roomMember.create({
            data: {
                roomId: parseInt(roomId, 10),
                userId: parseInt(memberId, 10),
                role
            }
        });
    }

    async changeGroupName(roomId, name) {
        return await this.db.room.update({
            where: { id: parseInt(roomId, 10) },
            data: { name }
        });
    }

    async deleteMessage(messageId, userId) {
        return await this.db.message.update({
            where: { id: parseInt(messageId, 10), senderId: userId },
            data: { isDeleted: true }
        });
    }

    async editMessage(messageId, userId, text) {
        return await this.db.message.update({
            where: { id: parseInt(messageId, 10), senderId: userId },
            data: { text, isEdited: true }
        });
    }

    async createSocketMessage(senderId, data) {
        const { text, replyTo, attachments, roomId } = data;
        return await this.db.message.create({
            data: {
                text,
                senderId,
                roomId: parseInt(roomId, 10),
                replyTo: replyTo ? parseInt(replyTo, 10) : null,
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
        });
    }

    async markMessageRead(messageId, userId, roomId) {
        const messageIdNum = parseInt(messageId, 10);
        const userIdNum = parseInt(userId, 10);
        const roomIdNum = parseInt(roomId, 10);

        const member = await this.db.roomMember.findUnique({
            where: {
                roomId_userId: {
                    roomId: roomIdNum,
                    userId: userIdNum
                }
            }
        });

        if (!member) {
            console.error(`User ${userId} is not a member of room ${roomId}`);
            return null;
        }

        const [readEntry] = await this.db.$transaction([
            this.db.messageRead.upsert({
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
            this.db.messageReceipt.upsert({
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
        ]);

        return readEntry;
    }
}

export const defaultChatRepository = new ChatRepository();
