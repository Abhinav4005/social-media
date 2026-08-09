import { prisma } from "../lib/prisma.js";

/**
 * Story Repository isolating DB queries for Stories and StoryFeeds.
 * Fulfills SRP & DIP.
 */
export class StoryRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async createStory(data) {
        return await this.db.story.create({
            data: {
                ...data,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            }
        });
    }

    async getActiveStoriesFeed(userId, limit = 20, cursor = null) {
        const queryOption = {
            where: {
                userId,
                story: {
                    is: {
                        expiresAt: { gt: new Date() },
                        mediaUrl: { not: "" },
                    }
                }
            },
            include: {
                story: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true } },
                        views: { where: { viewerId: userId }, select: { id: true } }
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit + 1
        };

        if (cursor) {
            queryOption.cursor = { id: cursor };
            queryOption.skip = 1;
        }

        return await this.db.storyFeed.findMany(queryOption);
    }

    async createStoryFeedRow(userId, storyId, createdAt) {
        const uId = Number(userId);
        const sId = Number(storyId);
        const existing = await this.db.storyFeed.findFirst({
            where: { userId: uId, storyId: sId }
        });
        if (existing) return existing;

        return await this.db.storyFeed.create({
            data: {
                userId: uId,
                storyId: sId,
                createdAt: createdAt || new Date(),
            }
        });
    }

    async markStorySeen(storyId, viewerId) {

        return await this.db.storyView.upsert({
            where: {
                storyId_viewerId: {
                    storyId: parseInt(storyId, 10),
                    viewerId: parseInt(viewerId, 10)
                }
            },
            update: { viewedAt: new Date() },
            create: {
                storyId: parseInt(storyId, 10),
                viewerId: parseInt(viewerId, 10)
            }
        });
    }

    async updateStoryMediaUrl(storyId, mediaUrl) {
        return await this.db.story.update({
            where: { id: storyId },
            data: { mediaUrl }
        });
    }

    async findUserConnectionsForFanout(userId) {
        return await this.db.user.findUnique({
            where: { id: userId },
            select: {
                followers: {
                    select: { followerId: true }
                },
                requestedFriendShips: {
                    where: { status: "ACCEPTED" },
                    select: { requesterId: true }
                },
                receivedFriendShips: {
                    where: { status: "ACCEPTED" },
                    select: { addresseeId: true }
                }
            }
        });
    }

    async createManyStoryFeedRows(rows) {
        if (!rows || rows.length === 0) return;
        return await this.db.storyFeed.createMany({
            data: rows,
            skipDuplicates: true
        });
    }

    async findExpiredStories() {
        return await this.db.story.findMany({
            where: {
                expiresAt: { lte: new Date() }
            },
            select: { id: true }
        });
    }

    async deleteExpiredStories(storyIds) {
        if (!storyIds || storyIds.length === 0) return;

        return await this.db.$transaction([
            this.db.storyFeed.deleteMany({
                where: { storyId: { in: storyIds } }
            }),
            this.db.storyView.deleteMany({
                where: { storyId: { in: storyIds } }
            }),
            this.db.story.deleteMany({
                where: { id: { in: storyIds } }
            })
        ]);
    }
}

export const defaultStoryRepository = new StoryRepository();

