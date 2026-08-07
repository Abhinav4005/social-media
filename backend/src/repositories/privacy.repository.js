import { prisma } from "../lib/prisma.js";

/**
 * Privacy Repository handling database operations for UserBlock, UserPrivacySetting, and PrivacyList.
 * Fulfills Single Responsibility Principle (SRP).
 */
export class PrivacyRepository {
    async blockUser(userId, blockedUserId) {
        // Create block record & delete existing follower/friendship relations in transaction
        return await prisma.$transaction(async (tx) => {
            const block = await tx.userBlock.upsert({
                where: {
                    userId_blockedUserId: { userId, blockedUserId }
                },
                create: { userId, blockedUserId },
                update: {},
            });

            // Remove friendships & followers
            await tx.friendShip.deleteMany({
                where: {
                    OR: [
                        { requesterId: userId, addresseeId: blockedUserId },
                        { requesterId: blockedUserId, addresseeId: userId }
                    ]
                }
            });

            await tx.follower.deleteMany({
                where: {
                    OR: [
                        { followerId: userId, followingId: blockedUserId },
                        { followerId: blockedUserId, followingId: userId }
                    ]
                }
            });

            return block;
        });
    }

    async unblockUser(userId, blockedUserId) {
        return await prisma.userBlock.deleteMany({
            where: { userId, blockedUserId }
        });
    }

    async isBlocked(userId1, userId2) {
        const count = await prisma.userBlock.count({
            where: {
                OR: [
                    { userId: userId1, blockedUserId: userId2 },
                    { userId: userId2, blockedUserId: userId1 }
                ]
            }
        });
        return count > 0;
    }

    async getBlockedUserIds(userId) {
        const blocks = await prisma.userBlock.findMany({
            where: {
                OR: [
                    { userId },
                    { blockedUserId: userId }
                ]
            },
            select: { userId: true, blockedUserId: true }
        });

        const blockedIds = new Set();
        blocks.forEach(b => {
            if (b.userId === userId) blockedIds.add(b.blockedUserId);
            if (b.blockedUserId === userId) blockedIds.add(b.userId);
        });

        return Array.from(blockedIds);
    }

    async getBlockedUsers(userId) {
        const blocks = await prisma.userBlock.findMany({
            where: { userId },
            include: {
                blockedUser: {
                    select: { id: true, name: true, email: true, profileImage: true, bio: true }
                }
            }
        });
        return blocks.map(b => b.blockedUser);
    }

    async getPrivacySettings(userId) {
        // userId has no @unique constraint — use findFirst + create instead of upsert
        let settings = await prisma.userPrivacySetting.findFirst({ where: { userId } });
        if (!settings) {
            settings = await prisma.userPrivacySetting.create({ data: { userId } });
        }
        return settings;
    }

    async updatePrivacySettings(userId, settingsData) {
        // userId has no @unique constraint — use findFirst + create/update instead of upsert
        const existing = await prisma.userPrivacySetting.findFirst({ where: { userId } });
        if (existing) {
            return await prisma.userPrivacySetting.update({
                where: { id: existing.id },
                data: settingsData,
            });
        }
        return await prisma.userPrivacySetting.create({ data: { userId, ...settingsData } });
    }

    async createPrivacyList(userId, name) {
        return await prisma.privacyList.create({
            data: { userId, name },
            include: { members: { include: { member: { select: { id: true, name: true, profileImage: true } } } } }
        });
    }

    async getPrivacyLists(userId) {
        return await prisma.privacyList.findMany({
            where: { userId },
            include: { members: { include: { member: { select: { id: true, name: true, profileImage: true } } } } }
        });
    }

    async addListMember(listId, memberId) {
        return await prisma.privacyListMember.create({
            data: { listId, memberId }
        });
    }

    async removeListMember(listId, memberId) {
        return await prisma.privacyListMember.deleteMany({
            where: { listId, memberId }
        });
    }

    async deletePrivacyList(userId, listId) {
        return await prisma.privacyList.deleteMany({
            where: { id: listId, userId }
        });
    }
}

export const defaultPrivacyRepository = new PrivacyRepository();
