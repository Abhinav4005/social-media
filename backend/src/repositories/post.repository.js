import { prisma } from "../lib/prisma.js";

const USER_BASIC_SELECT = { id: true, name: true, profileImage: true };

const COMMENTS_WITH_AUTHOR_AND_REPLIES = {
    where: { parentId: null },
    include: {
        user: { select: USER_BASIC_SELECT },
        replies: {
            include: {
                user: { select: USER_BASIC_SELECT }
            }
        }
    }
};

/**
 * Post Repository handling database persistence for Posts, Comments, Privacy, Likes, and Bookmarks.
 * Adheres to Single Responsibility Principle (SRP) by isolating database access logic.
 * Supports Dependency Inversion (DIP) by abstracting database operations.
 */
export class PostRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async createPost(data, comments = [], visibility = "PUBLIC") {
        const newPost = await this.db.post.create({
            data: {
                title: data.title,
                description: data.description,
                image: data.image || "",
                video: data.video || "",
                userId: data.userId,
                ...(comments?.length
                    ? { comments: { create: comments.map(content => ({ content, userId: data.userId })) } }
                    : {})
            },
            include: {
                comments: true,
            }
        });

        if (newPost) {
            await this.db.postPrivacy.create({
                data: {
                    postId: newPost.id,
                    visibility,
                }
            });
        }

        return newPost;
    }

    async updatePost(postId, userId, data) {
        return await this.db.post.updateMany({
            where: { id: postId, userId },
            data,
        });
    }

    async getPostById(postId) {
        return await this.db.post.findUnique({
            where: { id: postId },
            include: {
                comments: COMMENTS_WITH_AUTHOR_AND_REPLIES,
                post_likes: true,
                user: true,
            },
        });
    }

    async deletePost(postId, userId) {
        return await this.db.post.delete({
            where: { id: postId, userId },
        });
    }

    async getPostsByUser(userId) {
        return await this.db.post.findMany({
            where: { userId },
            include: {
                comments: COMMENTS_WITH_AUTHOR_AND_REPLIES,
                post_likes: true,
                user: { select: { id: true, name: true, profileImage: true, email: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getAllPosts() {
        return await this.db.post.findMany({
            include: {
                comments: COMMENTS_WITH_AUTHOR_AND_REPLIES,
                post_likes: true,
                user: { select: { id: true, name: true, profileImage: true, email: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async findCommentById(commentId) {
        return await this.db.comment.findUnique({
            where: { id: commentId },
        });
    }

    async createComment({ postId, userId, content, parentId = null }) {
        return await this.db.comment.create({
            data: {
                content,
                postId,
                userId,
                parentId,
            },
            include: {
                user: { select: { id: true, name: true, profileImage: true } },
                replies: { include: { user: { select: { id: true, name: true, profileImage: true } } } },
                post: { select: { userId: true } }
            }
        });
    }

    async deleteComment(commentId, userId) {
        const comment = await this.db.comment.findFirst({
            where: { id: commentId, userId }
        });
        if (!comment) return null;

        if (comment.parentId) {
            return await this.db.comment.delete({ where: { id: commentId } });
        }
        await this.db.comment.deleteMany({ where: { parentId: commentId } });
        return await this.db.comment.delete({ where: { id: commentId } });
    }

    async updateComment(commentId, userId, data) {
        return await this.db.comment.update({
            where: { id: commentId, userId },
            data,
        });
    }

    async searchPosts(searchTerm) {
        return await this.db.post.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
                    { user: { email: { contains: searchTerm, mode: 'insensitive' } } },
                    { comments: { some: { content: { contains: searchTerm, mode: 'insensitive' } } } }
                ]
            }
        });
    }

    async toggleSavedPost(postId, userId) {
        const existing = await this.db.savedPost.findUnique({
            where: { userId_postId: { userId, postId } }
        });
        if (existing) {
            await this.db.savedPost.delete({
                where: { userId_postId: { userId, postId } }
            });
            return { isSaved: false };
        }
        const savedPost = await this.db.savedPost.create({
            data: { postId, userId }
        });
        return { isSaved: true, savedPost };
    }

    async toggleCommentLike(commentId, userId, status = "LIKE") {
        const existingLike = await this.db.commentLike.findUnique({
            where: { commentId_userId: { commentId, userId } }
        });

        let reaction;
        if (!existingLike) {
            reaction = await this.db.commentLike.create({
                data: { commentId, userId, status },
            });
        } else if (existingLike.status === status) {
            await this.db.commentLike.delete({
                where: { commentId_userId: { commentId, userId } }
            });
            reaction = null;
        } else {
            reaction = await this.db.commentLike.update({
                where: { commentId_userId: { commentId, userId } },
                data: { status }
            });
        }

        const likeCount = await this.db.commentLike.count({ where: { commentId } });
        return { reaction, likeCount };
    }

    async getCommentLikes(commentId) {
        return await this.db.commentLike.findMany({
            where: { commentId }
        });
    }

    async togglePostReaction(postId, userId, status) {
        const existingReaction = await this.db.postLike.findUnique({
            where: { postId_userId: { postId, userId } }
        });

        let reaction;
        if (!existingReaction) {
            reaction = await this.db.postLike.create({ data: { postId, userId, status } });
        } else if (existingReaction.status === status) {
            await this.db.postLike.delete({ where: { postId_userId: { postId, userId } } });
            reaction = null;
        } else {
            reaction = await this.db.postLike.update({
                where: { postId_userId: { postId, userId } },
                data: { status }
            });
        }

        const likeCount = await this.db.postLike.count({ where: { postId, status: "LIKE" } });
        const dislikeCount = await this.db.postLike.count({ where: { postId, status: "DISLIKE" } });

        return { reaction, likeCount, dislikeCount };
    }

    async getPostLikes(postId) {
        return await this.db.postLike.count({
            where: { postId, status: "LIKE" }
        });
    }

    async getPostFeed(limit = 10, page = 1) {
        const take = Number(limit);
        const skip = (Number(page) - 1) * take;

        const posts = await this.db.post.findMany({
            take,
            skip,
            include: {
                post_likes: true,
                comments: COMMENTS_WITH_AUTHOR_AND_REPLIES,
                user: { select: USER_BASIC_SELECT },
                savedPost: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalPosts = await this.db.post.count();
        const hasMore = skip + posts.length < totalPosts;

        return { posts, totalPosts, hasMore, page: Number(page) };
    }

    async updatePostVisibility(postId, visibility) {
        return await this.db.postPrivacy.update({
            where: { postId },
            data: { visibility }
        });
    }

    async toggleSavedPost(postId, userId) {
        const existingSave = await this.db.savedPost.findUnique({
            where: { userId_postId: { userId, postId } }
        });

        if (existingSave) {
            await this.db.savedPost.delete({
                where: { userId_postId: { userId, postId } }
            });
            return { isSaved: false };
        } else {
            const saved = await this.db.savedPost.create({
                data: { userId, postId }
            });
            return { isSaved: true, savedPost: saved };
        }
    }

    async getSavedPosts(userId) {
        const savedRecords = await this.db.savedPost.findMany({
            where: { userId },
            include: {
                post: {
                    include: {
                        comments: COMMENTS_WITH_AUTHOR_AND_REPLIES,
                        post_likes: true,
                        user: { select: USER_BASIC_SELECT },
                        savedPost: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        return savedRecords.map(r => r.post).filter(Boolean);
    }
}

export const defaultPostRepository = new PostRepository();
