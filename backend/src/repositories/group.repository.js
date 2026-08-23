import { prisma } from "../lib/prisma.js";

export class GroupRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async createGroup(data) {
        return await this.db.group.create({ data });
    }

    async findGroupById(id) {
        return await this.db.group.findUnique({
            where: { id },
            include: {
                members: { include: { user: { select: { id: true, name: true, profileImage: true } } } },
                _count: { select: { members: true, posts: true } }
            }
        });
    }

    async findAllGroups({ visibility, limit = 20, offset = 0 }) {
        const where = {};
        if (visibility) where.visibility = visibility;

        return await this.db.group.findMany({
            where,
            include: {
                _count: { select: { members: true, posts: true } }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
        });
    }

    async findGroupsByUser(userId) {
        return await this.db.group.findMany({
            where: { members: { some: { userId } } },
            include: {
                _count: { select: { members: true, posts: true } }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    async discoverGroups(userId, { limit = 20, offset = 0 }) {
        return await this.db.group.findMany({
            where: {
                visibility: "PUBLIC",
                members: { none: { userId } }
            },
            include: {
                _count: { select: { members: true, posts: true } }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
        });
    }

    async addMember(groupId, userId, role = "MEMBER") {
        return await this.db.groupMember.create({
            data: { groupId, userId, role }
        });
    }

    async removeMember(groupId, userId) {
        return await this.db.groupMember.delete({
            where: { groupId_userId: { groupId, userId } }
        });
    }

    async findMembership(groupId, userId) {
        return await this.db.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } }
        });
    }

    async updateGroup(id, data) {
        return await this.db.group.update({
            where: { id },
            data
        });
    }

    async deleteGroup(id) {
        return await this.db.group.delete({ where: { id } });
    }

    async createGroupPost(groupId, postId) {
        return await this.db.groupPost.create({
            data: { groupId, postId }
        });
    }

    async findGroupPosts(groupId, { limit = 20, offset = 0 } = {}) {
        const groupPosts = await this.db.groupPost.findMany({
            where: { groupId },
            include: {
                post: {
                    include: {
                        comments: {
                            where: { parentId: null },
                            include: {
                                user: { select: { id: true, name: true, profileImage: true } },
                                replies: {
                                    include: {
                                        user: { select: { id: true, name: true, profileImage: true } }
                                    }
                                }
                            }
                        },
                        post_likes: true,
                        user: { select: { id: true, name: true, profileImage: true, email: true } },
                        savedPost: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
        });
        return groupPosts.map(gp => gp.post).filter(Boolean);
    }

    async findGroupMembers(groupId) {
        return await this.db.groupMember.findMany({
            where: { groupId },
            include: {
                user: { select: { id: true, name: true, profileImage: true, email: true, bio: true } }
            },
            orderBy: { joinedAt: "asc" }
        });
    }

    async updateMemberRole(groupId, userId, role) {
        return await this.db.groupMember.update({
            where: { groupId_userId: { groupId, userId } },
            data: { role }
        });
    }
}

export const defaultGroupRepository = new GroupRepository();
