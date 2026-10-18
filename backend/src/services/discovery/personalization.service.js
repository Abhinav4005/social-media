import { prisma } from "../../lib/prisma.js";

export class PersonalizationService {
    /**
     * Get personalized feed for user with recommendation badges.
     */
    async getPersonalizedFeed(userId, limit = 20) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                interests: true,
                following: { select: { followingId: true } },
            },
        });

        const userInterests = user?.interests || [];
        const followingIds = user?.following.map((f) => f.followingId) || [];

        // Fetch candidate posts
        const candidatePosts = await prisma.post.findMany({
            where: {
                userId: { not: userId },
            },
            include: {
                user: { select: { id: true, name: true, profileImage: true } },
                post_likes: { select: { userId: true } },
                _count: { select: { comments: true, post_likes: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        // Score candidates
        const scored = candidatePosts.map((post) => {
            let score = 0;
            let reason = "Recommended for you";

            // 1. Social Gravity (followed user posted or liked)
            if (followingIds.includes(post.userId)) {
                score += 15;
                reason = `Posted by ${post.user.name}, who you follow`;
            }

            const likedByFollowed = post.post_likes.some((l) => followingIds.includes(l.userId));
            if (likedByFollowed) {
                score += 10;
                reason = `Liked by people you follow`;
            }

            // 2. Category / Interest match
            if (post.category && userInterests.includes(post.category.toLowerCase())) {
                score += 12;
                reason = `Matches your interest in ${post.category}`;
            }

            // 3. Popularity weight
            score += Math.min(post._count.post_likes * 2 + post._count.comments * 3, 20);

            return {
                ...post,
                recommendationReason: reason,
                recommendationScore: score,
            };
        });

        return scored
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, limit);
    }

    /**
     * Get daily serendipitous discovery post (1 global surprise post per day).
     */
    async getSerendipityFeed(userId) {
        const seed = new Date().toISOString().slice(0, 10);
        const count = await prisma.post.count({ where: { userId: { not: userId } } });

        if (count === 0) {
            return null;
        }

        // Deterministic random selection based on daily seed
        const skipIndex = Math.floor(Math.abs(Math.sin(seed.charCodeAt(0) + seed.charCodeAt(seed.length - 1))) * count) % count;

        const serendipityPost = await prisma.post.findFirst({
            where: { userId: { not: userId } },
            skip: skipIndex,
            include: {
                user: { select: { id: true, name: true, profileImage: true, city: true } },
                _count: { select: { comments: true, post_likes: true } },
            },
        });

        return {
            post: serendipityPost,
            badge: "🌀 Serendipity Discovery of the Day",
            subtitle: "Zero algorithms. A random story from across the world.",
        };
    }

    /**
     * Get Daily 5 intentional feed cap for user.
     */
    async getDaily5Feed(userId) {
        const personalized = await this.getPersonalizedFeed(userId, 5);

        // Count today's view history to calculate progress ring
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const viewedTodayCount = await prisma.postViewHistory.count({
            where: {
                userId,
                viewedAt: { gte: startOfToday },
            },
        });

        return {
            posts: personalized,
            dailyTarget: 5,
            viewedCount: Math.min(viewedTodayCount, 5),
            isCompleted: viewedTodayCount >= 5,
        };
    }

    /**
     * Update user interest tags.
     */
    async updateUserInterests(userId, interests) {
        return prisma.user.update({
            where: { id: userId },
            data: { interests },
            select: { id: true, interests: true },
        });
    }
}

export default new PersonalizationService();
