import { defaultUserService } from "../services/user.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getUserProfile = async (req, res, next) => {
    try {
        const userProfile = await defaultUserService.getUserProfile(req.user.id);
        return ApiResponse.success(res, { user: userProfile }, "User profile fetched successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.userId || req.params.id || req.query.userId;
        const user = await defaultUserService.getUserById(userId);
        return ApiResponse.success(res, { user }, "User details fetched successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const updateUserProfile = async (req, res, next) => {
    try {
        const user = await defaultUserService.updateUserProfile(req.user.id, {
            ...req.body,
            files: req.files,
        });
        return ApiResponse.success(res, { user }, "User profile updated successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const searchUsersByQuery = async (req, res, next) => {
    try {
        const query = req.query.q || req.query.query || req.query.search || "";
        const users = await defaultUserService.searchUsers(query, req.user.id);
        return ApiResponse.success(res, { users }, "Users retrieved successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const followUser = async (req, res, next) => {
    try {
        const followingId = parseInt(req.params.id || req.params.userId || req.body.followingId, 10);
        if (isNaN(followingId)) {
            return ApiResponse.error(res, "Valid followingId is required", 400);
        }
        const result = await defaultUserService.toggleFollowUser(req.user.id, followingId);
        return ApiResponse.success(res, result, result.message || "Follow toggled successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const getFollowers = async (req, res, next) => {
    try {
        const userId = (req.params.id || req.params.userId || req.query.userId) ? parseInt(req.params.id || req.params.userId || req.query.userId, 10) : req.user.id;
        const followers = await defaultUserService.getFollowers(userId);
        return ApiResponse.success(res, { followers }, "Followers retrieved successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const getFollowing = async (req, res, next) => {
    try {
        const userId = (req.params.id || req.params.userId || req.query.userId) ? parseInt(req.params.id || req.params.userId || req.query.userId, 10) : req.user.id;
        const following = await defaultUserService.getFollowing(userId);
        return ApiResponse.success(res, { following }, "Following users retrieved successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const getUserFeed = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const feed = await defaultUserService.getUserFeed(req.user.id, page, limit);
        return ApiResponse.paginate(res, feed.posts || feed, page, limit, feed.total || 0, "User feed retrieved successfully");
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};

export const getAllPhotosOfUser = async (req, res, next) => {
    try {
        const userId = (req.params.id || req.params.userId || req.query.userId) ? parseInt(req.params.id || req.params.userId || req.query.userId, 10) : req.user.id;
        const photos = await defaultUserService.getAllPhotosOfUser(userId);
        return ApiResponse.success(res, photos, "User photos retrieved successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error(error);
        return next(error);
    }
};