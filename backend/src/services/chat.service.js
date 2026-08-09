import { defaultChatRepository } from "../repositories/chat.repository.js";
import { defaultStorageAdapter } from "../adapters/storage/storage.factory.js";

/**
 * Chat Service managing rooms, members, and chat message business rules.
 * Fulfills SRP, OCP, DIP.
 */
export class ChatService {
    constructor(chatRepository = defaultChatRepository, storageAdapter = defaultStorageAdapter) {
        this.chatRepository = chatRepository;
        this.storageAdapter = storageAdapter;
    }

    async createRoom({ userId, name, type, memberIds }) {
        if (!type || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
            throw { status: 400, message: "Missing required fields" };
        }

        if (type === "DM") {
            if (memberIds.length !== 1) {
                throw { status: 400, message: "DM room must have exactly one memberId" };
            }
            const otherId = memberIds[0];
            const [a, b] = [userId, parseInt(otherId, 10)].sort((x, y) => x - y);
            const dmKey = `${a}_${b}`;

            const existingRoom = await this.chatRepository.findExistingDMRoom(dmKey);
            if (existingRoom) {
                return { isExisting: true, room: existingRoom };
            }

            const room = await this.chatRepository.createDMRoom(name, dmKey, userId, otherId);
            return { isExisting: false, room };
        }

        if (!name) {
            throw { status: 400, message: "Group room must have a name" };
        }

        const room = await this.chatRepository.createGroupRoom(name, type, userId, memberIds);
        return { isExisting: false, room };
    }

    async getRooms(userId) {
        if (!userId) throw { status: 400, message: "Missing userId" };
        return await this.chatRepository.getUserRooms(userId);
    }

    async getRoomMessages(roomId) {
        if (!roomId || isNaN(roomId)) throw { status: 400, message: "Invalid roomId" };
        return await this.chatRepository.getRoomMessages(roomId);
    }

    async addMemberToRoom(roomId, memberId) {
        if (!roomId || !memberId) throw { status: 400, message: "roomId and memberId are required" };
        return await this.chatRepository.addMemberToRoom(roomId, memberId);
    }

    async changeGroupName(roomId, name) {
        if (!roomId || !name) throw { status: 400, message: "roomId and name are required" };
        return await this.chatRepository.changeGroupName(roomId, name);
    }

    async deleteMessage(messageId, userId) {
        if (!messageId || isNaN(messageId)) throw { status: 400, message: "Invalid messageId" };
        return await this.chatRepository.deleteMessage(messageId, userId);
    }
}

export const defaultChatService = new ChatService();
