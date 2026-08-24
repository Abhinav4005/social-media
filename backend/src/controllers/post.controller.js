import { defaultPostService } from "../services/post.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createPost = async (req, res, next) => {
    try {
        const post = await defaultPostService.createPost({
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            comments: req.body.comments,
            status: req.body.status,
            files: req.files,
        });
        return ApiResponse.success(res, { post }, "Post created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId || req.body.postId, 10);
        const post = await defaultPostService.updatePost({
            postId,
            userId: req.user.id,
            title: req.body.title,
            description: req.body.description,
            files: req.files,
        });
        return ApiResponse.success(res, { post }, "Post updated successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getPostById = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId, 10);
        const post = await defaultPostService.getPostById(postId);
        return ApiResponse.success(res, { post }, "Post retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId, 10);
        const deletedPost = await defaultPostService.deletePost({
            postId,
            userId: req.user.id,
        });
        return ApiResponse.success(res, { postId, post: deletedPost }, "Post deleted successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getPostsByUser = async (req, res, next) => {
    try {
        const posts = await defaultPostService.getPostsByUser(req.user.id);
        return ApiResponse.success(res, { posts }, "User posts retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getAllPosts = async (req, res, next) => {
    try {
        const posts = await defaultPostService.getAllPosts();
        return ApiResponse.success(res, { posts }, "All posts retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const commentOnPost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId || req.body.postId, 10);
        const comment = await defaultPostService.addComment({
            postId,
            userId: req.user.id,
            content: req.body.content,
            parentId: req.body.parentId,
        });
        return ApiResponse.success(res, { comment }, "Comment added successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId || req.query.commentId, 10);
        await defaultPostService.deleteComment({
            commentId,
            userId: req.user.id,
        });
        return ApiResponse.success(res, { commentId }, "Comment deleted successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const updateComment = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId || req.query.commentId, 10);
        const { content, parentId } = req.body;
        const comment = await defaultPostService.updateComment({
            commentId,
            userId: req.user.id,
            content,
            parentId,
        });
        return ApiResponse.success(res, { comment }, "Comment updated successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const commentLike = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId || req.query.commentId, 10);
        const { status } = req.body;
        const { reaction, likeCount } = await defaultPostService.toggleCommentLike({
            commentId,
            userId: req.user.id,
            status,
        });
        return ApiResponse.success(res, { reaction, likeCount }, "Comment liked successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getCommentLikes = async (req, res, next) => {
    try {
        const commentId = parseInt(req.params.commentId || req.query.commentId, 10);
        const likes = await defaultPostService.getCommentLikes(commentId);
        return ApiResponse.success(res, { commentLikes: likes }, "Comment likes fetched successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getPostsBySearch = async (req, res, next) => {
    try {
        const posts = await defaultPostService.searchPosts(req.query.search);
        return ApiResponse.success(res, { posts }, "Posts search completed", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const reactOnPost = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId || req.body.postId, 10);
        const { status } = req.body;
        const { reaction, likeCount, dislikeCount } = await defaultPostService.togglePostReaction({
            postId,
            userId: req.user.id,
            status,
        });
        return ApiResponse.success(res, { reaction, likeCount, dislikeCount }, "Reaction updated successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getPostLikes = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.query.postId, 10);
        const likes = await defaultPostService.getPostLikes(postId);
        return ApiResponse.success(res, { likes }, "Likes retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const getPostFeed = async (req, res, next) => {
    try {
        const { limit = 10, page = 1 } = req.query;
        const feed = await defaultPostService.getPostFeed({ limit, page });
        return ApiResponse.paginate(res, feed.posts || feed, page, limit, feed.total || 0, "Posts retrieved successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error(error);
        return next(error);
    }
};

export const changePostStatus = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.body.postId, 10);
        const status = req.body.status;
        const updatePostStatus = await defaultPostService.changePostVisibility({
            postId,
            status,
        });
        return ApiResponse.success(res, { status: updatePostStatus }, "Post status changed successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error in changing post status", error);
        return next(error);
    }
};

export const savePostBookmark = async (req, res, next) => {
    try {
        const postId = parseInt(req.params.id || req.body.postId, 10);
        const result = await defaultPostService.toggleSavedPost({
            postId,
            userId: req.user.id,
        });
        return ApiResponse.success(res, result, "Post bookmark toggled successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error in saving post: ", error);
        return next(error);
    }
};

export const getSavedPosts = async (req, res, next) => {
    try {
        const posts = await defaultPostService.getSavedPosts(req.user.id);
        return ApiResponse.success(res, { posts }, "Saved posts retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error in fetching saved posts: ", error);
        return next(error);
    }
};

export const getWatchFeed = async (req, res, next) => {
    try {
        const category = req.query.category || "all";
        const posts = await defaultPostService.getWatchFeed(category);
        return ApiResponse.success(res, { posts }, "Watch feed retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error in fetching watch feed: ", error);
        return next(error);
    }
};