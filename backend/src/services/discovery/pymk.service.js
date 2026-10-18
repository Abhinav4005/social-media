import { prisma } from "../../lib/prisma.js";

export class PymkService {
    async getPeopleYouMayKnow(userId, limit = 10) {
        // 1. Fetch user's current friends and pending requests to exclude
        const userFriendships = await prisma.friendShip.findMany({
            where: {
                OR: [{ requesterId: userId }, { addresseeId: userId }],
            },
            select: { requesterId: true, addresseeId: true },
        });

        const excludedUserIds = new Set([userId]);
        userFriendships.forEach((f) => {
            excludedUserIds.add(f.requesterId);
            excludedUserIds.add(f.addresseeId);
        });

        // 2. Get user's current location & groups for contextual scoring
        const currentUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { city: true, groupMemberships: { select: { groupId: true } } },
        });

        const userGroupIds = currentUser?.groupMemberships.map((g) => g.groupId) || [];

        // 3. Find candidate users (not blocked, not already friends/pending)
        const candidates = await prisma.user.findMany({
            where: {
                id: { notIn: Array.from(excludedUserIds) },
                isDeleted: false,
            },
            select: {
                id: true,
                name: true,
                profileImage: true,
                bio: true,
                city: true,
                receivedFriendShips: {
                    where: { status: "ACCEPTED" },
                    select: { requesterId: true, addresseeId: true },
                },
                requestedFriendShips: {
                    where: { status: "ACCEPTED" },
                    select: { requesterId: true, addresseeId: true },
                },
                groupMemberships: { select: { groupId: true } },
            },
            take: 50,
        });

        // 4. Calculate mutual score for each candidate
        const scoredCandidates = candidates.map((candidate) => {
            // Extract candidate's friend IDs
            const candidateFriendIds = new Set();
            candidate.receivedFriendShips.forEach((f) => candidateFriendIds.add(f.requesterId));
            candidate.requestedFriendShips.forEach((f) => candidateFriendIds.add(f.addresseeId));

            // Calculate mutual friends
            let mutualFriendsCount = 0;
            candidateFriendIds.forEach((friendId) => {
                if (excludedUserIds.has(friendId) && friendId !== userId) {
                    mutualFriendsCount++;
                }
            });

            // Calculate shared groups
            const candidateGroupIds = candidate.groupMemberships.map((g) => g.groupId);
            const sharedGroupsCount = candidateGroupIds.filter((gid) => userGroupIds.includes(gid)).length;

            // Location proximity bonus
            const isSameCity = Boolean(currentUser?.city && candidate.city && currentUser.city.toLowerCase() === candidate.city.toLowerCase());

            // Final score formula
            const rankScore = mutualFriendsCount * 5 + sharedGroupsCount * 3 + (isSameCity ? 4 : 0);

            return {
                id: candidate.id,
                name: candidate.name,
                profileImage: candidate.profileImage,
                bio: candidate.bio,
                city: candidate.city,
                mutualFriendsCount,
                sharedGroupsCount,
                isSameCity,
                rankScore,
            };
        });

        // 5. Sort by rank score descending and return top N
        return scoredCandidates
            .sort((a, b) => b.rankScore - a.rankScore)
            .slice(0, limit);
    }
}

export default new PymkService();
