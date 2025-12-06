import { prisma } from "../lib/prisma.js";
import uploadImageToImageKit, { replaceImageInImageKit } from "../utils/uploadImage.js";

export const createRoom = async (req, res) => {
    try {
        const { name, type, memberIds } = req.body;
        const userId = req.user.id;

        if(!type || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        if(type === "DM"){
            if(memberIds.length !== 1) {
                return res.status(400).json({ message: "DM room must have exactly one memberId" });
            }
            const otherId = memberIds[0];
            const [a, b] = [userId, otherId].sort();
            const dmKey = `${a}_${b}`;

            const existingRoom = await prisma.room.findFirst({
                where: {
                    dmKey: dmKey,
                    type: "DM"
                },
                include: {
                    members: true,
                }
            })
            if(existingRoom) {
                return res.status(200).json({ message: "DM Room already exists", room: existingRoom });
            }

            const room = await prisma.room.create({
                data: {
                    name,
                    type,
                    dmKey,
                    members: {
                        create: [
                            { userId: userId },
                            { userId: parseInt(otherId, 10) }
                        ]
                    }
                }
            });
            return res.status(201).json({ message: "DM Room created successfully", room: room });
        } 
        if(!name) {
            return res.status(400).json({ message: "Group room must have a name" });
        }

        const newRoom = await prisma.room.create({
            data: {
                name,
                type,
                members: {
                    create: [
                        { userId: userId, role : "ADMIN"},
                        ...memberIds.map(id => ({ userId: id}))
                    ]
                }
            }
        });

        return res.status(201).json({ message: "Group Room created successfully", room: newRoom });
    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getRooms = async (req, res) => {
    try {
        const userId = req.user.id;

        if(!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }
        const rooms = await prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    }
                },
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, profileImage: true }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: { createdAt: 'desc' },
                    select: { 
                        id: true, 
                        text: true, 
                        senderId: true, 
                        createdAt: true,
                        type: true 
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return res.status(200).json({ message: "Rooms fetched successfully", rooms: rooms });
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const addMemberToRoom = async (req, res) => {
    try {
        const { roomId, userId} = req.query;

        if(!roomId || !userId) {
            return res.status(400).json({ message: "Missing roomId or userId" });
        }
        const room = await prisma.room.findUnique({
            where: { id: parseInt(roomId) },
        });
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }
        const existingMember = await prisma.roomMember.findFirst({
            where: {
                roomId: parseInt(roomId),
                userId: parseInt(userId)
            }
        })
        if (existingMember) {
            return res.status(400).json({ message: "User is already a member of the room" });
        }

        await prisma.roomMember.create({
            data: {
                roomId: parseInt(roomId),
                userId: parseInt(userId)
            }
        })
        return res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
        console.error("Error adding member to room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, senderId, roomId, type, attachments, replyTo } = req.body;

        if (!text || !senderId || !roomId || !type) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newMessage = await prisma.message.create({
            data: {
                text,
                senderId,
                roomId,
                type: type || "TEXT",
                attachments: attachments ? {
                    create: attachments.map(url => ({
                        url,
                        type: url.endsWith('.png') ||
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
                    }))
                } : undefined,
                replyTo: replyTo || null,
            },
            include: {
                sender: true,
                attachments: true,
                reactions: true,
            }
        })
        if (!newMessage) {
            return res.status(500).json({ message: "Failed to send message" });
        }
        return res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            return res.status(400).json({ message: "Missing roomId" });
        }

        const messages = await prisma.message.findMany({
            where: { roomId: parseInt(roomId) },
            include: {
                sender: true,
                attachments: true,
                reactions: true,
                readBy: {
                    include: {
                        member: {
                            include: { user: true }
                        }
                    }
                },
                receipts: true,
                room: {
                    include: {
                        members:{
                            select:{
                                isTyping: true
                            }
                        }
                    }
                }
            }
        });

        const formattedMessages = messages.map((msg) => ({
            ...msg,
            readBy: msg.readBy.map((r) => ({
                id: r.member.user.id,
                name: r.member.user.name
            }))
        }));

        return res.status(200).json({ message: "Messages fetched successfully", messages: formattedMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const changeGroupName = async(req, res) => {
    try {
        const userId = req?.user?.id;
        const { roomId, name } = req.body;
        const profileImage = req?.files?.profileImage ? req.files.profileImage[0] : null;

        const dataToUpdate = {};

        const existingRoom = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if(name) dataToUpdate.name = name;
        if(description) dataToUpdate.description = description;
        if(profileImage) {
            if(existingRoom?.profileImage) {
                await replaceImageInImageKit(existingRoom?.profileImage, profileImage, "social-hub/rooms", existingRoom?.profileImageId)
            }
            const uploadImage = await uploadImageToImageKit(profileImage, "social-hub/rooms")
            dataToUpdate.profileImage = uploadImage.url;
            dataToUpdate.profilImageId = uploadImage.fileId;
        }
        if(!userId) {
            return res.status(401).json({ message: "Unauthorized Access" });
        }

        if(!roomId) {
            return res.status(400).json({ message: "roomId is required" });
        }

        if(!name) {
            return res.status(400).json({ message: "group name is required for update" });
        }

        const room = await prisma.room.findUnique({
            where: { id: roomId }
        })

        if(!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        const updatedRoom = await prisma.room.update({
            where: { id: roomId },
            data:dataToUpdate
        })

        return res.status(200).json({ 
            message: "Group name updated successfully",
            updatedRoom
        });
    } catch (error) {
        console.error("Error in updating group name", error);
        return res.status(500).json({ message:"Error in updating group name" });
    }
}

export const deleteMessage = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { messageId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    const message = await prisma.message.findUnique({
      where: { id: parseInt(messageId) },
      include: {
        attachments: true,
        reactions: true,
        readBy: true,
        replies: true,
        receipts: true,
      },
    });

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ message: "Forbidden: You can only delete your own messages" });
    }

    for (const attachment of message.attachments) {
      try {
        await imagekit.deleteFile(attachment.fileId);
      } catch (err) {
        console.warn(`Failed to delete file ${attachment.fileId}:`, err.message);
      }
    }

    await prisma.attachment.deleteMany({ where: { messageId: message.id } });
    await prisma.reaction.deleteMany({ where: { messageId: message.id } });
    await prisma.messageRead.deleteMany({ where: { messageId: message.id } });
    await prisma.messageReceipt.deleteMany({ where: { messageId: message.id } });
    await prisma.notification.deleteMany({ where: { messageId: message.id } });
    await prisma.message.updateMany({
      where: { replyTo: message.id },
      data: { replyTo: null },
    });

    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: {
        text: "This message has been deleted",
        isDeleted: true,
      },
    });

    return res.status(200).json({
      message: "Message deleted successfully",
      deletedMessage: updatedMessage,
    });
  } catch (error) {
    console.error("Error in deleting message", error);
    return res.status(500).json({ message: "Error in deleting message" });
  }
};