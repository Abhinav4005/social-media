import { defaultPostRepository } from "../repositories/post.repository.js";
import { defaultStorageAdapter } from "../adapters/storage/storage.factory.js";
import { POSTVISIBILITYSTATUS } from "../lib/type.js";
import { SecurityValidator } from "../utils/security.validator.js";
import { sanitizePostDTO } from "../types/interfaces.js";
import { eventBus, DOMAIN_EVENTS } from "../events/eventBus.js";
import { nestComments } from "../helper/formatComment.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Post Service handling Post domain business logic.
 * Adheres to SRP, DIP, and Security validation rules.
 */
export class PostService {
    constructor(postRepository = defaultPostRepository, storageAdapter = defaultStorageAdapter) {
        this.postRepository = postRepository;
        this.storageAdapter = storageAdapter;
    }

    async createPost({ userId, title, description, comments, status, files }) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanTitle = SecurityValidator.sanitizeString(title);
        const cleanDescription = SecurityValidator.sanitizeString(description);

        if (!cleanTitle || !cleanDescription) {
            throw new ApiError(400, "Title and description are required");
        }

        const imageFile = files?.image ? files.image[0] : null;
        const videoFile = files?.video ? files.video[0] : null;

        const imageUrl = imageFile ? await this.storageAdapter.uploadFile(imageFile, "social-hub/images") : null;
        const videoUrl = videoFile ? await this.storageAdapter.uploadFile(videoFile, "social-hub/videos") : null;

        let postVisibility = POSTVISIBILITYSTATUS.PUBLIC;
        if (status === POSTVISIBILITYSTATUS.CUSTOM) postVisibility = POSTVISIBILITYSTATUS.CUSTOM;
        else if (status === POSTVISIBILITYSTATUS.PRIVATE) postVisibility = POSTVISIBILITYSTATUS.PRIVATE;
        else if (status === POSTVISIBILITYSTATUS.FRIENDS) postVisibility = POSTVISIBILITYSTATUS.FRIENDS;

        const newPost = await this.postRepository.createPost(
            {
                title: cleanTitle,
                description: cleanDescription,
                image: imageUrl?.url || "",
                video: videoUrl?.url || "",
                userId: cleanUserId,
            },
            comments,
            postVisibility
        );

        if (!newPost) throw new ApiError(500, "Failed to create post");
        eventBus.publish(DOMAIN_EVENTS.POST_CREATED, { postId: newPost.id, userId: cleanUserId });
        return sanitizePostDTO(newPost);
    }

    async updatePost({ postId, userId, title, description, files }) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");

        const image = files?.image ? files.image[0] : null;
        const video = files?.video ? files.video[0] : null;

        const updateData = {};
        if (title) updateData.title = SecurityValidator.sanitizeString(title);
        if (description) updateData.description = SecurityValidator.sanitizeString(description);
        if (image) updateData.image = image.originalname;
        if (video) updateData.video = video.originalname;

        if (Object.keys(updateData).length === 0) {
            throw new ApiError(400, "No valid fields to update");
        }

        const result = await this.postRepository.updatePost(cleanPostId, cleanUserId, updateData);
        if (result.count === 0) {
            throw new ApiError(404, "Post not found or permission denied");
        }
        return { id: cleanPostId, ...updateData };
    }

    async getPostById(postId) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        const post = await this.postRepository.getPostById(cleanPostId);
        if (!post) throw new ApiError(404, "Post not found");
        return sanitizePostDTO(post);
    }

    async deletePost({ postId, userId }) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        return await this.postRepository.deletePost(cleanPostId, cleanUserId);
    }

    async getPostsByUser(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const posts = await this.postRepository.getPostsByUser(cleanUserId);
        if (!posts || posts.length === 0) return [];
        return posts.map(sanitizePostDTO);
    }

    async getAllPosts() {
        const posts = await this.postRepository.getAllPosts();
        if (!posts || posts.length === 0) return [];
        return posts.map(sanitizePostDTO);
    }

    async addComment({ postId, userId, content, parentId }) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanContent = SecurityValidator.sanitizeString(content);

        if (!cleanContent) throw new ApiError(400, "Comment content is required");

        let parsedParentId = null;
        if (parentId) {
            parsedParentId = SecurityValidator.validateId(parentId, "ParentCommentId");
            const parentComment = await this.postRepository.findCommentById(parsedParentId);
            if (!parentComment) throw new ApiError(404, "Parent comment not found");
        }

        return await this.postRepository.createComment({
            postId: cleanPostId,
            userId: cleanUserId,
            content: cleanContent,
            parentId: parsedParentId,
        });
    }

    async updateComment({ commentId, userId, content, parentId }) {
        const cleanCommentId = SecurityValidator.validateId(commentId, "CommentId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const cleanContent = SecurityValidator.sanitizeString(content);

        const updateData = { content: cleanContent };
        if (parentId) updateData.parentId = SecurityValidator.validateId(parentId, "ParentId");

        return await this.postRepository.updateComment(cleanCommentId, cleanUserId, updateData);
    }

    async deleteComment({ commentId, userId }) {
        const cleanCommentId = SecurityValidator.validateId(commentId, "CommentId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");

        const result = await this.postRepository.deleteComment(cleanCommentId, cleanUserId);
        if (!result) throw new ApiError(404, "Comment not found or permission denied");
        return result;
    }

    async toggleCommentLike({ commentId, userId, status }) {
        const cleanCommentId = SecurityValidator.validateId(commentId, "CommentId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.postRepository.toggleCommentLike(cleanCommentId, cleanUserId, status);
    }

    async getCommentLikes(commentId) {
        const cleanCommentId = SecurityValidator.validateId(commentId, "CommentId");
        return await this.postRepository.getCommentLikes(cleanCommentId);
    }

    async searchPosts(search) {
        const cleanSearch = SecurityValidator.sanitizeString(search);
        if (!cleanSearch || cleanSearch.length < 3) {
            throw new ApiError(400, "Search query must be at least 3 characters long");
        }
        const posts = await this.postRepository.searchPosts(cleanSearch);
        return posts.map(sanitizePostDTO);
    }

    async togglePostReaction({ postId, userId, status }) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.postRepository.togglePostReaction(cleanPostId, cleanUserId, status);
    }

    async getPostLikes(postId) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        return await this.postRepository.getPostLikes(cleanPostId);
    }

    async getPostFeed({ limit = 10, page = 1 }) {
        const feedData = await this.postRepository.getPostFeed(limit, page);
        feedData.posts.forEach(post => {
            if (post.comments) {
                post.comments = nestComments(post.comments);
            }
        });
        return feedData;
    }

    async changePostVisibility({ postId, status }) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        return await this.postRepository.updatePostVisibility(cleanPostId, status);
    }

    async toggleSavedPost({ postId, userId }) {
        const cleanPostId = SecurityValidator.validateId(postId, "PostId");
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        return await this.postRepository.toggleSavedPost(cleanPostId, cleanUserId);
    }

    async getSavedPosts(userId) {
        const cleanUserId = SecurityValidator.validateId(userId, "UserId");
        const posts = await this.postRepository.getSavedPosts(cleanUserId);
        return (posts || []).map(sanitizePostDTO);
    }

    async getWatchFeed(category = "all") {
        const posts = await this.postRepository.getWatchFeed(category);
        return (posts || []).map(sanitizePostDTO);
    }
}

export const defaultPostService = new PostService();
