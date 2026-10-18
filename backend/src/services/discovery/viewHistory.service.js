import { prisma } from "../../lib/prisma.js";

export class ViewHistoryService {
    /**
     * Log a post view event for a user (upserts viewedAt timestamp).
     * @param {number} userId
     * @param {number} postId
     */
    async recordView(userId, postId) {
        return prisma.postViewHistory.upsert({
            where: {
                userId_postId: { userId, postId },
            },
            update: {
                viewedAt: new Date(),
            },
            create: {
                userId,
                postId,
            },
        });
    }

    /**
     * Fetch recently viewed posts for a user.
     * @param {number} userId
     * @param {number} limit
     */
    async getRecentlyViewed(userId, limit = 20) {
        const history = await prisma.postViewHistory.findMany({
            where: { userId },
            orderBy: { viewedAt: "desc" },
            take: limit,
            include: {
                post: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true } },
                        _count: { select: { comments: true, post_likes: true } },
                    },
                },
            },
        });

        return history.map((item) => ({
            ...item.post,
            viewedAt: item.viewedAt,
        }));
    }

    /**
     * Clear user's entire viewing history.
     * @param {number} userId
     */
    async clearHistory(userId) {
        return prisma.postViewHistory.deleteMany({
            where: { userId },
        });
    }
}

export default new ViewHistoryService();
