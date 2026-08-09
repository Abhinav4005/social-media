import { defaultPrivacyService } from "../services/privacy.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const blockUser = async (req, res, next) => {
    try {
        const targetUserId = req.params.userId || req.body.targetUserId || req.body.userId;
        const result = await defaultPrivacyService.blockUser(req.user.id, targetUserId);
        return ApiResponse.success(res, result, "User blocked successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error blocking user:", error);
        return next(error);
    }
};

export const unblockUser = async (req, res, next) => {
    try {
        const targetUserId = req.params.userId || req.body.targetUserId || req.body.userId;
        const result = await defaultPrivacyService.unblockUser(req.user.id, targetUserId);
        return ApiResponse.success(res, result, "User unblocked successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error unblocking user:", error);
        return next(error);
    }
};

export const getBlockedUsers = async (req, res, next) => {
    try {
        const users = await defaultPrivacyService.getBlockedUsers(req.user.id);
        return ApiResponse.success(res, { users }, "Blocked users retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching blocked users:", error);
        return next(error);
    }
};

export const getPrivacySettings = async (req, res, next) => {
    try {
        const settings = await defaultPrivacyService.getPrivacySettings(req.user.id);
        return ApiResponse.success(res, { settings }, "Privacy settings retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching privacy settings:", error);
        return next(error);
    }
};

export const updatePrivacySettings = async (req, res, next) => {
    try {
        const settings = await defaultPrivacyService.updatePrivacySettings(req.user.id, req.body);
        return ApiResponse.success(res, { settings }, "Privacy settings updated successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error updating privacy settings:", error);
        return next(error);
    }
};

export const createPrivacyList = async (req, res, next) => {
    try {
        const list = await defaultPrivacyService.createPrivacyList(req.user.id, req.body.name);
        return ApiResponse.success(res, { list }, "Privacy list created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating privacy list:", error);
        return next(error);
    }
};

export const getPrivacyLists = async (req, res, next) => {
    try {
        const lists = await defaultPrivacyService.getPrivacyLists(req.user.id);
        return ApiResponse.success(res, { lists }, "Privacy lists retrieved successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching privacy lists:", error);
        return next(error);
    }
};

export const addListMember = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const memberId = req.body.memberId || req.body.userId;
        const result = await defaultPrivacyService.addListMember(req.user.id, listId, memberId);
        return ApiResponse.success(res, { result }, "Member added to privacy list successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error adding list member:", error);
        return next(error);
    }
};

export const removeListMember = async (req, res, next) => {
    try {
        const { listId, memberId } = req.params;
        const result = await defaultPrivacyService.removeListMember(req.user.id, listId, memberId);
        return ApiResponse.success(res, { result }, "Member removed from privacy list successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error removing list member:", error);
        return next(error);
    }
};

export const deletePrivacyList = async (req, res, next) => {
    try {
        const { listId } = req.params;
        const result = await defaultPrivacyService.deletePrivacyList(req.user.id, listId);
        return ApiResponse.success(res, { result }, "Privacy list deleted successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error deleting privacy list:", error);
        return next(error);
    }
};
