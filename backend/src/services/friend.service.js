import { defaultFriendRepository } from "../repositories/friend.repository.js";
import { FRIENDSHIPSTATUS } from "../lib/type.js";

/**
 * Friend Service managing friend request rules, accept/decline workflows, and relationship queries.
 * Fulfills SRP & DIP.
 */
export class FriendService {
    constructor(friendRepository = defaultFriendRepository) {
        this.friendRepository = friendRepository;
    }

    async sendFriendRequest(requesterId, addresseeIdParam) {
        const addresseeId = parseInt(addresseeIdParam, 10);
        if (isNaN(addresseeId)) throw { status: 400, message: "addresseeId is required and must be a number." };
        if (requesterId === addresseeId) throw { status: 400, message: "You cannot send friend request to yourself." };

        const existingRequest = await this.friendRepository.findExistingRequest(requesterId, addresseeId);
        if (existingRequest) throw { status: 400, message: "Friend request already exists." };

        const existingFollower = await this.friendRepository.findFollowerRelation(requesterId, addresseeId);
        const friendRequest = await this.friendRepository.createFriendRequest(requesterId, addresseeId);

        let friendShip = null;
        if (!existingFollower) {
            friendShip = await this.friendRepository.createFollowerRelation(requesterId, addresseeId);
        }

        return { friendRequest, friendShip };
    }

    async respondToFriendRequest(userId, requestIdParam, action) {
        const requestId = parseInt(requestIdParam, 10);
        if (isNaN(requestId) || !Object.values(FRIENDSHIPSTATUS).includes(action)) {
            throw { status: 400, message: "Invalid requestId or action." };
        }

        const friendRequest = await this.friendRepository.findFriendRequestById(requestId);
        if (!friendRequest) throw { status: 404, message: "Friend request not found." };
        if (userId !== friendRequest.addresseeId) throw { status: 403, message: "You are not authorized to respond to this friend request." };
        if (friendRequest.status === FRIENDSHIPSTATUS.BLOCKED) throw { status: 400, message: "This request has been blocked." };

        const updated = await this.friendRepository.updateFriendRequestStatus(requestId, action);
        return updated;
    }

    async getFriends(userId) {
        if (!userId) throw { status: 401, message: "Unauthorized access" };
        return await this.friendRepository.getFriends(userId);
    }

    async getPendingRequests(userId) {
        if (!userId) throw { status: 401, message: "Unauthorized access" };
        return await this.friendRepository.getPendingRequests(userId);
    }

    async cancelFriendRequest(userId, requestIdParam) {
        const requestId = parseInt(requestIdParam, 10);
        if (isNaN(requestId)) throw { status: 400, message: "Invalid requestId." };

        const friendRequest = await this.friendRepository.findFriendRequestById(requestId);
        if (!friendRequest) throw { status: 404, message: "Friend request not found." };
        if (userId !== friendRequest.requesterId && userId !== friendRequest.addresseeId) {
            throw { status: 403, message: "You are not authorized to cancel this friend request." };
        }

        return await this.friendRepository.deleteFriendRequest(requestId);
    }
}

export const defaultFriendService = new FriendService();
