import { defaultGroupRepository } from "../repositories/group.repository.js";
import { defaultPostRepository } from "../repositories/post.repository.js";
import { ApiError } from "../utils/apiError.js";

export class GroupService {
    constructor(groupRepository = defaultGroupRepository, postRepository = defaultPostRepository) {
        this.groupRepository = groupRepository;
        this.postRepository = postRepository;
    }

    async createGroup(userId, { name, description, visibility, coverImage, coverImageId }) {
        if (!name || name.trim().length < 2) {
            throw new ApiError(400, "Group name must be at least 2 characters");
        }

        const group = await this.groupRepository.createGroup({
            name: name.trim(),
            description: description?.trim() || null,
            visibility: visibility || "PUBLIC",
            coverImage: coverImage || null,
            coverImageId: coverImageId || null,
        });

        // Creator becomes ADMIN
        await this.groupRepository.addMember(group.id, userId, "ADMIN");

        return await this.groupRepository.findGroupById(group.id);
    }

    async getGroupById(groupId) {
        const group = await this.groupRepository.findGroupById(groupId);
        if (!group) {
            throw new ApiError(404, "Group not found");
        }
        return group;
    }

    async getUserGroups(userId) {
        return await this.groupRepository.findGroupsByUser(userId);
    }

    async discoverGroups(userId, { limit, offset }) {
        return await this.groupRepository.discoverGroups(userId, { limit, offset });
    }

    async joinGroup(userId, groupId) {
        const group = await this.groupRepository.findGroupById(groupId);
        if (!group) {
            throw new ApiError(404, "Group not found");
        }

        const existing = await this.groupRepository.findMembership(groupId, userId);
        if (existing) {
            throw new ApiError(400, "You are already a member of this group");
        }

        if (group.visibility === "PRIVATE") {
            throw new ApiError(403, "This is a private group. You need an invitation to join.");
        }

        await this.groupRepository.addMember(groupId, userId);
        return await this.groupRepository.findGroupById(groupId);
    }

    async leaveGroup(userId, groupId) {
        const membership = await this.groupRepository.findMembership(groupId, userId);
        if (!membership) {
            throw new ApiError(400, "You are not a member of this group");
        }

        if (membership.role === "ADMIN") {
            const group = await this.groupRepository.findGroupById(groupId);
            const adminCount = group.members.filter(m => m.role === "ADMIN").length;
            if (adminCount <= 1) {
                throw new ApiError(400, "You are the only admin. Transfer admin role before leaving.");
            }
        }

        await this.groupRepository.removeMember(groupId, userId);
        return { message: "Left group successfully" };
    }

    async updateGroup(userId, groupId, data) {
        const membership = await this.groupRepository.findMembership(groupId, userId);
        if (!membership || membership.role !== "ADMIN") {
            throw new ApiError(403, "Only group admins can update group settings");
        }

        const updateData = {};
        if (data.name) updateData.name = data.name.trim();
        if (data.description !== undefined) updateData.description = data.description?.trim() || null;
        if (data.visibility) updateData.visibility = data.visibility;
        if (data.coverImage) updateData.coverImage = data.coverImage;
        if (data.coverImageId) updateData.coverImageId = data.coverImageId;

        await this.groupRepository.updateGroup(groupId, updateData);
        return await this.groupRepository.findGroupById(groupId);
    }

    async deleteGroup(userId, groupId) {
        const membership = await this.groupRepository.findMembership(groupId, userId);
        if (!membership || membership.role !== "ADMIN") {
            throw new ApiError(403, "Only group admins can delete the group");
        }

        await this.groupRepository.deleteGroup(groupId);
        return { message: "Group deleted successfully" };
    }

    async createGroupPost(userId, groupId, { title, description, image, video }) {
        const membership = await this.groupRepository.findMembership(groupId, userId);
        if (!membership) {
            throw new ApiError(403, "You must be a member of this group to post");
        }

        const post = await this.postRepository.createPost({
            userId,
            title: title?.trim() || "Group Post",
            description: description?.trim() || "",
            image: image || "",
            video: video || "",
        });

        await this.groupRepository.createGroupPost(groupId, post.id);
        return post;
    }

    async getGroupPosts(userId, groupId, { limit = 20, offset = 0 } = {}) {
        const group = await this.groupRepository.findGroupById(groupId);
        if (!group) throw new ApiError(404, "Group not found");

        if (group.visibility === "PRIVATE") {
            const membership = await this.groupRepository.findMembership(groupId, userId);
            if (!membership) throw new ApiError(403, "Private group. Access denied.");
        }

        return await this.groupRepository.findGroupPosts(groupId, { limit, offset });
    }

    async getGroupMembers(groupId) {
        const group = await this.groupRepository.findGroupById(groupId);
        if (!group) throw new ApiError(404, "Group not found");
        return await this.groupRepository.findGroupMembers(groupId);
    }

    async removeGroupMember(requestingUserId, groupId, targetUserId) {
        const requestingMembership = await this.groupRepository.findMembership(groupId, requestingUserId);
        if (!requestingMembership || requestingMembership.role !== "ADMIN") {
            throw new ApiError(403, "Only group admins can remove members");
        }

        if (requestingUserId === targetUserId) {
            throw new ApiError(400, "Use leave group to remove yourself");
        }

        await this.groupRepository.removeMember(groupId, targetUserId);
        return { message: "Member removed from group" };
    }

    async updateMemberRole(requestingUserId, groupId, targetUserId, role) {
        const requestingMembership = await this.groupRepository.findMembership(groupId, requestingUserId);
        if (!requestingMembership || requestingMembership.role !== "ADMIN") {
            throw new ApiError(403, "Only group admins can change member roles");
        }

        if (!["ADMIN", "MEMBER"].includes(role)) {
            throw new ApiError(400, "Invalid role");
        }

        await this.groupRepository.updateMemberRole(groupId, targetUserId, role);
        return { message: `Member role updated to ${role}` };
    }
}

export const defaultGroupService = new GroupService();

