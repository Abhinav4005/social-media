import { defaultGroupService } from "../services/group.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const createGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const group = await defaultGroupService.createGroup(userId, req.body);
        return ApiResponse.success(res, group, "Group created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating group:", error);
        return next(error);
    }
};

export const getGroupById = async (req, res, next) => {
    try {
        const groupId = parseInt(req.params.id);
        const group = await defaultGroupService.getGroupById(groupId);
        return ApiResponse.success(res, group, "Group fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching group:", error);
        return next(error);
    }
};

export const getUserGroups = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groups = await defaultGroupService.getUserGroups(userId);
        return ApiResponse.success(res, groups, "User groups fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching user groups:", error);
        return next(error);
    }
};

export const discoverGroups = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const groups = await defaultGroupService.discoverGroups(userId, { limit, offset });
        return ApiResponse.success(res, groups, "Discover groups fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error discovering groups:", error);
        return next(error);
    }
};

export const joinGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const group = await defaultGroupService.joinGroup(userId, groupId);
        return ApiResponse.success(res, group, "Joined group successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error joining group:", error);
        return next(error);
    }
};

export const leaveGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const result = await defaultGroupService.leaveGroup(userId, groupId);
        return ApiResponse.success(res, result, "Left group successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error leaving group:", error);
        return next(error);
    }
};

export const updateGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const group = await defaultGroupService.updateGroup(userId, groupId, req.body);
        return ApiResponse.success(res, group, "Group updated successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error updating group:", error);
        return next(error);
    }
};

export const deleteGroup = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const result = await defaultGroupService.deleteGroup(userId, groupId);
        return ApiResponse.success(res, result, "Group deleted successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error deleting group:", error);
        return next(error);
    }
};

export const createGroupPost = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const post = await defaultGroupService.createGroupPost(userId, groupId, req.body);
        return ApiResponse.success(res, post, "Group post created successfully", 201);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error creating group post:", error);
        return next(error);
    }
};

export const getGroupPosts = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const posts = await defaultGroupService.getGroupPosts(userId, groupId, { limit, offset });
        return ApiResponse.success(res, posts, "Group posts fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching group posts:", error);
        return next(error);
    }
};

export const getGroupMembers = async (req, res, next) => {
    try {
        const groupId = parseInt(req.params.id);
        const members = await defaultGroupService.getGroupMembers(groupId);
        return ApiResponse.success(res, members, "Group members fetched successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error fetching group members:", error);
        return next(error);
    }
};

export const removeGroupMember = async (req, res, next) => {
    try {
        const requestingUserId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const targetUserId = parseInt(req.params.userId);
        const result = await defaultGroupService.removeGroupMember(requestingUserId, groupId, targetUserId);
        return ApiResponse.success(res, result, "Group member removed successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error removing group member:", error);
        return next(error);
    }
};

export const updateMemberRole = async (req, res, next) => {
    try {
        const requestingUserId = req.user?.id;
        const groupId = parseInt(req.params.id);
        const targetUserId = parseInt(req.params.userId);
        const { role } = req.body;
        const result = await defaultGroupService.updateMemberRole(requestingUserId, groupId, targetUserId, role);
        return ApiResponse.success(res, result, "Member role updated successfully");
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error updating member role:", error);
        return next(error);
    }
};

