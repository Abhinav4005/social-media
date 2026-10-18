import { prisma } from "../../lib/prisma.js";

export class SearchService {
    async searchWithFilters({ query = "", entity = "all", category = "all", location = "", dateRange = "all", sortBy = "relevance", limit = 20, page = 1 }) {
        const skip = (page - 1) * limit;
        const results = { posts: [], users: [], groups: [], events: [], marketplace: [] };

        const searchFilter = query ? { contains: query, mode: "insensitive" } : undefined;

        // Date filter calculation
        let dateFilter = undefined;
        if (dateRange !== "all") {
            const now = new Date();
            if (dateRange === "today") {
                now.setHours(0, 0, 0, 0);
                dateFilter = { gte: now };
            } else if (dateRange === "week") {
                now.setDate(now.getDate() - 7);
                dateFilter = { gte: now };
            } else if (dateRange === "month") {
                now.setMonth(now.getMonth() - 1);
                dateFilter = { gte: now };
            }
        }

        // 1. Search Posts
        if (entity === "all" || entity === "posts") {
            const postWhere = {};
            if (query) {
                postWhere.OR = [
                    { title: searchFilter },
                    { description: searchFilter },
                ];
            }
            if (category !== "all") {
                postWhere.category = { equals: category, mode: "insensitive" };
            }
            if (location) {
                postWhere.locationName = { contains: location, mode: "insensitive" };
            }
            if (dateFilter) {
                postWhere.createdAt = dateFilter;
            }

            results.posts = await prisma.post.findMany({
                where: postWhere,
                include: {
                    user: { select: { id: true, name: true, profileImage: true } },
                    _count: { select: { comments: true, post_likes: true } },
                },
                orderBy: sortBy === "latest" ? { createdAt: "desc" } : { post_likes: { _count: "desc" } },
                take: limit,
                skip,
            });
        }

        // 2. Search Users
        if (entity === "all" || entity === "users") {
            const userWhere = { isDeleted: false };
            if (query) {
                userWhere.OR = [{ name: searchFilter }, { bio: searchFilter }];
            }
            if (location) {
                userWhere.city = { contains: location, mode: "insensitive" };
            }

            results.users = await prisma.user.findMany({
                where: userWhere,
                select: {
                    id: true,
                    name: true,
                    profileImage: true,
                    bio: true,
                    city: true,
                    _count: { select: { followers: true } },
                },
                take: limit,
                skip,
            });
        }

        // 3. Search Groups
        if (entity === "all" || entity === "groups") {
            const groupWhere = { visibility: "PUBLIC" };
            if (query) {
                groupWhere.OR = [{ name: searchFilter }, { description: searchFilter }];
            }

            results.groups = await prisma.group.findMany({
                where: groupWhere,
                include: {
                    _count: { select: { members: true } },
                },
                take: limit,
                skip,
            });
        }

        // 4. Search Events
        if (entity === "all" || entity === "events") {
            const eventWhere = {};
            if (query) {
                eventWhere.OR = [{ title: searchFilter }, { description: searchFilter }];
            }
            if (location) {
                eventWhere.location = { contains: location, mode: "insensitive" };
            }
            if (dateFilter) {
                eventWhere.startDate = dateFilter;
            }

            results.events = await prisma.event.findMany({
                where: eventWhere,
                include: {
                    creator: { select: { id: true, name: true, profileImage: true } },
                    _count: { select: { attendees: true } },
                },
                take: limit,
                skip,
            });
        }

        // 5. Search Marketplace
        if (entity === "all" || entity === "marketplace") {
            const marketWhere = { isSold: false };
            if (query) {
                marketWhere.OR = [{ title: searchFilter }, { description: searchFilter }];
            }
            if (location) {
                marketWhere.location = { contains: location, mode: "insensitive" };
            }

            results.marketplace = await prisma.marketplaceListing.findMany({
                where: marketWhere,
                include: {
                    seller: { select: { id: true, name: true, profileImage: true } },
                },
                take: limit,
                skip,
            });
        }

        return results;
    }
}

export default new SearchService();
