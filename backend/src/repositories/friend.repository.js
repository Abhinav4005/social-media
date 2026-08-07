import { prisma } from "../lib/prisma.js";

/**
 * Friend Repository encapsulating database queries for FriendShips and Followers.
 * Fulfills SRP & DIP.
 */
export class FriendRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findExistingRequest(requesterId, addresseeId) {
        return await this.db.friendShip.findFirst({
            where: {
                OR: [
                    { requesterId, addresseeId },
                    { requesterId: addresseeId, addresseeId: requesterId },
                ]
            }
        });
    }

    async findFollowerRelation(requesterId, addresseeId) {
        return await this.db.follower.findFirst({
            where: {
                OR: [
                    { followerId: requesterId, followingId: addresseeId },
                    { followerId: addresseeId, followingId: requesterId },
                ]
            }
        });
    }

    async createFriendRequest(requesterId, addresseeId) {
        return await this.db.friendShip.create({
            data: {
                requesterId,
                addresseeId,
                status: "PENDING",
            }
        });
    }

    async createFollowerRelation(followerId, followingId) {
        return await this.db.follower.create({
            data: { followerId, followingId }
        });
    }

    async findFriendRequestById(requestId) {
        return await this.db.friendShip.findUnique({
            where: { id: requestId }
        });
    }

    async updateFriendRequestStatus(requestId, status) {
        return await this.db.friendShip.update({
            where: { id: requestId },
            data: { status }
        });
    }

    async getFriends(userId) {
        return await this.db.friendShip.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: "ACCEPTED" },
                    { addresseeId: userId, status: "ACCEPTED" },
                ]
            },
            include: {
                requester: { select: { id: true, name: true, profileImage: true } },
                addressee: { select: { id: true, name: true, profileImage: true } },
            }
        });
    }

    async getPendingRequests(userId) {
        return await this.db.friendShip.findMany({
            where: { addresseeId: userId, status: "PENDING" },
            include: {
                requester: { select: { id: true, name: true, profileImage: true } }
            }
        });
    }

    async deleteFriendRequest(requestId) {
        return await this.db.friendShip.delete({
            where: { id: requestId }
        });
    }
}

export const defaultFriendRepository = new FriendRepository();
