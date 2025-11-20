import prisma from "../config/db.js";
import { FRIENDSHIPSTATUS } from "../lib/type.js";

export const sendFriendRequest = async (req, res) => {
    const { addresseeId } = req.query;
    const requesterId = req.user.id;
    try {
        if (requesterId === addresseeId) {
            return res.status(400).json({ message: "You cannot send friend request to yourself." });
        }

        if (!addresseeId) {
            return res.status(400).json({ message: "addresseeId is required." });
        }

        const existingRequest = await prisma.friendShip.findFirst({
            where: {
                OR: [
                    {
                        requesterId: parseInt(requesterId),
                        addresseeId: parseInt(addresseeId),
                    },
                    {
                        requesterId: parseInt(addresseeId),
                        addresseeId: parseInt(requesterId),
                    }
                ]
            }
        });


        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists." });
        }

        const existingFollowingOrFollower = await prisma.follower.findFirst({
            where: {
                OR: [
                    {
                        followerId: parseInt(requesterId),
                        followingId: parseInt(addresseeId),
                    },
                    {
                        followerId: parseInt(addresseeId),
                        followingId: parseInt(requesterId),
                    }
                ]
            }
        })

        if (existingFollowingOrFollower) {
            return res.status(400).json({ message: "You are already following this user." });
        }

        const friendRequest = await prisma.friendShip.create({
            data: {
                requesterId: parseInt(requesterId),
                addresseeId: parseInt(addresseeId),
                status: "PENDING"
            }
        })
        const friendShip = await prisma.follower.create({
            data: {
                followerId: parseInt(requesterId),
                followingId: parseInt(addresseeId),
            }
        });
        return res.status(201).json({ message: "Friend request sent successfully.", friendRequest, friendShip });
    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "An error occurred.", error: error.message });
    }
}

export const respondToFriendRequest = async (req, res) => {
    const { requestId, action } = req.query;
    const userId = req.user.id;
    try {
        if (!requestId || !Object.values(FRIENDSHIPSTATUS).includes(action)) {
            return res.status(400).json({ message: "Invalid requestId or action." });
        }

        const friendRequest = await prisma.friendShip.findUnique({
            where: { id: parseInt(requestId, 10) }
        });

        if (!userId || userId !== friendRequest?.addresseeId) {
            return res.status(403).json({ message: "You are not authorized to respond to this friend request." });
        }

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        if (friendRequest.status === FRIENDSHIPSTATUS.BLOCKED) {
            return res.status(400).json({ message: "This request has been blocked." });
        }

        if (friendRequest.status === FRIENDSHIPSTATUS.ACCEPTED) {
            return res.status(400).json({ message: "This request has already been accepted." });
        }

        if (friendRequest.status === FRIENDSHIPSTATUS.PENDING && action === FRIENDSHIPSTATUS.PENDING) {
            return res.status(400).json({ message: "Request is already pending." });
        }

        const updatedRequest = await prisma.friendShip.update({
            where: { id: parseInt(requestId, 10) },
            data: { status: action }
        });

        return res.status(200).json({
            message: `Friend request ${action.toLowerCase()} successfully.`,
            updatedRequest
        });
    } catch (error) {
        console.error("Error responding to friend request:", error);
        return res.status(500).json({ message: "An error occurred.", error: error.message });
    }
}

export const getFriendRequest = async (req, res) => {
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const friendRequests = await prisma.friendShip.findMany({
            where: {
                addresseeId: userId,
                status: FRIENDSHIPSTATUS.PENDING
            },
            include: {
                requester: true,
            }
        });

        if(!friendRequests) {
            return res.status(200).json({
                message: "No friend requests found",
                requests: [],
                total: 0,
                page: 1,
                limit: 10
            });
        }

        const userFriends = await prisma.friendShip.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: FRIENDSHIPSTATUS.ACCEPTED },
                    { addresseeId: userId, status: FRIENDSHIPSTATUS.ACCEPTED }
                ]
            }
        });

        const userFriendIds = new Set(
            userFriends.map(friend => 
                friend.requesterId === userId ? friend.addresseeId : friend.requesterId
            )
        );

        const requesterIds = friendRequests.map(req => req.requesterId);

        const allOtherFriends = await prisma.friendShip.findMany({
            where: {
                OR: [
                    { requesterId: { in: requesterIds }, status: FRIENDSHIPSTATUS.ACCEPTED },
                    { addresseeId: { in: requesterIds }, status: FRIENDSHIPSTATUS.ACCEPTED }
                ]
            }
        });

        const otherFriendMap = new Map();
        for(let friendship of allOtherFriends) {
            const reqId = friendship.requesterId;
            const addId = friendship.addresseeId;

            if(!otherFriendMap.has(reqId)) otherFriendMap.set(reqId, new Set());
            if(!otherFriendMap.has(addId)) otherFriendMap.set(addId, new Set());

            otherFriendMap.get(reqId).add(addId);
            otherFriendMap.get(addId).add(reqId);
        }

        for(let request of friendRequests) {
            const otherUserId = request.requesterId;
            const otherUserFriendsId = otherFriendMap.get(otherUserId) || new Set();

            const mutualFriends = [...userFriendIds].filter(id => 
                otherUserFriendsId.has(id)
            );

            request.mutualFriends = mutualFriends.length;
        }

        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const paginatedRequests = friendRequests.slice(offset, offset + limit);

        return res.status(200).json({
            message: "Friend requests fetched successfully",
            requests: paginatedRequests,
            total: friendRequests.length,
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getFriendsList = async (req, res) => {
    const userId = req.user.id;
    try {
        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const friends = await prisma.friendShip.findMany({
            where: {
                OR: [
                    { requesterId: userId, status: FRIENDSHIPSTATUS.ACCEPTED },
                    { addresseeId: userId, status: FRIENDSHIPSTATUS.ACCEPTED }
                ]
            },
            take: 50,
            include: {
                requester: {
                    select: { id: true, name: true, email: true, profileImage: true }
                },
                addressee: {
                    select: { id: true, name: true, email: true, profileImage: true }
                }
            }
        });

        const formattedFriends = friends.map(friend => {
            const isRequester = friend.requesterId === userId;
            const friendData = isRequester ? friend.addressee : friend.requester;
            return {
                id: friendData.id,
                name: friendData.name,
                email: friendData.email,
                profileImage: friendData.profileImage,
                friendshipId: friend.id
            };
        });

        return res.status(200).json({ message: "Friends fetched successfully", friends: formattedFriends });
    } catch (error) {
        console.error("Error fetching friends list:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const cancelFriendRequest = async (req, res) => {
    const { requestId } = req.query;
    const userId = req.user.id;
    try {
        if (!requestId) {
            return res.status(400).json({ message: "Missing requestId" });
        }

        const friendRequest = await prisma.friendShip.findUnique({
            where: { id: parseInt(requestId, 10) }
        });

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (friendRequest.requesterId !== userId) {
            return res.status(403).json({ message: "You are not authorized to cancel this friend request." });
        }

        await prisma.friendShip.delete({
            where: { id: parseInt(requestId, 10) }
        });

        return res.status(200).json({ message: "Friend request cancelled successfully." });
    } catch (error) {
        console.error("Error cancelling friend request:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const unFriend = async (req, res) => {
    const { friendshipId } = req.query;
    const userId = req.user.id;
    try {
        if(!friendshipId) {
            return res.status(400).json({ message: "Missing friendshipId" });
        }

        if(!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const friendship = await prisma.friendShip.findUnique({
            where: { id: parseInt(friendshipId, 10) }
        });

        if(!friendship) {
            return res.status(404).json({ message: "Friendship not found" });
        }

        if(friendship.requesterId !== userId && friendship.addresseeId !== userId) {
            return res.status(403).json({ message: "You are not authorized to unfriend this user." });
        }

        await prisma.friendShip.delete({
            where: { id: parseInt(friendshipId, 10) }
        });

        return res.status(200).json({ message: "Unfriend successful." });
    } catch (error) {
        console.error("Error unfriending user:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}