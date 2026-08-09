import { defaultPrivacyRepository } from "../repositories/privacy.repository.js";
import { SecurityValidator } from "../utils/security.validator.js";

/**
 * Privacy Service handling business rules for blocking users, updating privacy preferences, and list management.
 * Fulfills SRP & DIP.
 */
export class PrivacyService {
    constructor(privacyRepository = defaultPrivacyRepository) {
        this.privacyRepository = privacyRepository;
    }

    async blockUser(userId, targetUserId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanTargetId = SecurityValidator.validateId(targetUserId, "TargetUserId");

        if (cleanUserId === cleanTargetId) {
            throw { status: 400, message: "You cannot block yourself." };
        }

        await this.privacyRepository.blockUser(cleanUserId, cleanTargetId);
        return { message: "User blocked successfully." };
    }

    async unblockUser(userId, targetUserId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanTargetId = SecurityValidator.validateId(targetUserId, "TargetUserId");

        await this.privacyRepository.unblockUser(cleanUserId, cleanTargetId);
        return { message: "User unblocked successfully." };
    }

    async getBlockedUsers(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.privacyRepository.getBlockedUsers(cleanUserId);
    }

    async getPrivacySettings(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.privacyRepository.getPrivacySettings(cleanUserId);
    }

    async updatePrivacySettings(userId, { defaultPostVisibility, defaultMessageSetting, allowFollowersToMessage }) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");

        const updateData = {};
        if (defaultPostVisibility) updateData.defaultPostVisibility = defaultPostVisibility;
        if (defaultMessageSetting) updateData.defaultMessageSetting = defaultMessageSetting;
        if (typeof allowFollowersToMessage === "boolean") updateData.allowFollowersToMessage = allowFollowersToMessage;

        return await this.privacyRepository.updatePrivacySettings(cleanUserId, updateData);
    }

    async createPrivacyList(userId, name) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanName = SecurityValidator.sanitizeString(name);

        if (!cleanName) throw { status: 400, message: "List name is required." };

        return await this.privacyRepository.createPrivacyList(cleanUserId, cleanName);
    }

    async getPrivacyLists(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.privacyRepository.getPrivacyLists(cleanUserId);
    }

    async addListMember(userId, listId, memberId) {
        const cleanListId = SecurityValidator.validateId(listId, "ListId");
        const cleanMemberId = SecurityValidator.validateId(memberId, "MemberId");

        return await this.privacyRepository.addListMember(cleanListId, cleanMemberId);
    }

    async removeListMember(userId, listId, memberId) {
        const cleanListId = SecurityValidator.validateId(listId, "ListId");
        const cleanMemberId = SecurityValidator.validateId(memberId, "MemberId");

        return await this.privacyRepository.removeListMember(cleanListId, cleanMemberId);
    }

    async deletePrivacyList(userId, listId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanListId = SecurityValidator.validateId(listId, "ListId");

        return await this.privacyRepository.deletePrivacyList(cleanUserId, cleanListId);
    }
}

export const defaultPrivacyService = new PrivacyService();
