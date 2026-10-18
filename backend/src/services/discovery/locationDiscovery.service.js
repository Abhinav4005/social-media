import { prisma } from "../../lib/prisma.js";

export class LocationDiscoveryService {
    /**
     * Fetch posts, events, and active users near a specified city or lat/lng location.
     */
    async getNearbyContent({ city = "", lat = null, lng = null, radiusKm = 50, limit = 20 }) {
        const filterCity = city ? city.trim() : null;

        // 1. Nearby Posts
        const postWhere = {};
        if (filterCity) {
            postWhere.locationName = { contains: filterCity, mode: "insensitive" };
        }

        const nearbyPosts = await prisma.post.findMany({
            where: postWhere,
            include: {
                user: { select: { id: true, name: true, profileImage: true, city: true } },
                _count: { select: { comments: true, post_likes: true } },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        // 2. Nearby Events
        const eventWhere = {};
        if (filterCity) {
            eventWhere.location = { contains: filterCity, mode: "insensitive" };
        }

        const nearbyEvents = await prisma.event.findMany({
            where: eventWhere,
            include: {
                creator: { select: { id: true, name: true, profileImage: true } },
                _count: { select: { attendees: true } },
            },
            orderBy: { startDate: "asc" },
            take: limit,
        });

        // 3. Local Creators / Users
        const userWhere = { isDeleted: false };
        if (filterCity) {
            userWhere.city = { contains: filterCity, mode: "insensitive" };
        }

        const localCreators = await prisma.user.findMany({
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
        });

        return {
            location: filterCity || "Global Nearby",
            posts: nearbyPosts,
            events: nearbyEvents,
            creators: localCreators,
        };
    }
}

export default new LocationDiscoveryService();
