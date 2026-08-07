import { prisma } from "../lib/prisma.js";

/**
 * User Repository encapsulating all user persistence queries.
 * Fulfills SRP & DIP.
 */
export class UserRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async findById(userId) {
        return await this.db.user.findUnique({
            where: { id: userId },
            include: {
                followers: {
                    include: {
                        follower: {
                            select: { id: true, name: true, profileImage: true, email: true }
                        }
                    }
                },
                following: {
                    include: {
                        following: {
                            select: { id: true, name: true, profileImage: true, email: true }
                        }
                    }
                },
                receivedFriendShips: true,
                requestedFriendShips: true,
                posts: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true, email: true } },
                        comments: true,
                        post_likes: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });
    }

    async findByIdWithFullDetails(userId) {
        return await this.db.user.findUnique({
            where: { id: userId },
            include: {
                followers: true,
                following: true,
                posts: {
                    include: {
                        user: { select: { id: true, name: true, profileImage: true, email: true } },
                        comments: true,
                        post_likes: true,
                    },
                    orderBy: { createdAt: "desc" },
                },
                postLikes: true,
                requestedFriendShips: true,
                receivedFriendShips: true,
            },
        });
    }

    async findByEmail(email) {
        return await this.db.user.findUnique({ where: { email } });
    }

    async updateUser(userId, data) {
        return await this.db.user.update({
            where: { id: userId },
            data,
        });
    }

    async searchUsers(query, currentUserId) {
        return await this.db.user.findMany({
            where: {
                AND: [
                    { id: { not: currentUserId } },
                    { isDeleted: false },
                    {
                        OR: [
                            { name: { contains: query, mode: "insensitive" } },
                            { email: { contains: query, mode: "insensitive" } },
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                profileImage: true,
                bio: true,
            }
        });
    }

    async toggleFollow(followerId, followingId) {
        const existing = await this.db.follower.findUnique({
            where: {
                followerId_followingId: { followerId, followingId }
            }
        });

        if (existing) {
            await this.db.follower.delete({
                where: {
                    followerId_followingId: { followerId, followingId }
                }
            });
            return { message: "Unfollowed successfully", isFollowing: false };
        } else {
            await this.db.follower.create({
                data: { followerId, followingId }
            });
            return { message: "Followed successfully", isFollowing: true };
        }
    }

    async getFollowers(userId) {
        return await this.db.follower.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: { id: true, name: true, email: true, profileImage: true, bio: true }
                }
            }
        });
    }

    async getFollowing(userId) {
        return await this.db.follower.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: { id: true, name: true, email: true, profileImage: true, bio: true }
                }
            }
        });
    }

    async getUserFeed(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const posts = await this.db.post.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { user: { followers: { some: { followerId: userId } } } }
                ]
            },
            take: limit,
            skip: skip,
            include: {
                user: { select: { id: true, name: true, profileImage: true } },
                comments: true,
                post_likes: true,
                savedPost: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalPosts = await this.db.post.count({
            where: {
                OR: [
                    { userId: userId },
                    { user: { followers: { some: { followerId: userId } } } }
                ]
            }
        });

        return {
            posts,
            page,
            limit,
            totalPosts,
            hasMore: skip + posts.length < totalPosts
        };
    }

    async getAllPhotosOfUser(userId) {
        const user = await this.db.user.findUnique({
            where: { id: userId },
            select: { profileImage: true, coverImage: true }
        });
        const posts = await this.db.post.findMany({
            where: {
                userId: userId,
                image: { not: null, notIn: [""] }
            },
            select: { image: true }
        });

        const userImages = [];
        if (user?.profileImage) userImages.push(user.profileImage);
        if (user?.coverImage) userImages.push(user.coverImage);

        const postImages = posts.map(p => p.image).filter(Boolean);

        return {
            userImage: userImages,
            postImages: postImages
        };
    }
}

export const defaultUserRepository = new UserRepository();
