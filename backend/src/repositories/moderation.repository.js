import { prisma } from "../lib/prisma.js";

export class ModerationRepository {
    // --- Reports ---
    static async createReport(data) {
        return prisma.report.create({
            data,
            include: {
                reporter: { select: { id: true, name: true, email: true, profileImage: true } },
                reportedUser: { select: { id: true, name: true, email: true, profileImage: true } }
            }
        });
    }

    static async getReports({ status, targetType, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) where.status = status;
        if (targetType) where.targetType = targetType;

        const [reports, total] = await Promise.all([
            prisma.report.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    reporter: { select: { id: true, name: true, email: true, profileImage: true } },
                    reportedUser: { select: { id: true, name: true, email: true, profileImage: true } }
                }
            }),
            prisma.report.count({ where })
        ]);

        return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async getReportById(id) {
        return prisma.report.findUnique({
            where: { id: parseInt(id) },
            include: {
                reporter: { select: { id: true, name: true, email: true, profileImage: true } },
                reportedUser: { select: { id: true, name: true, email: true, profileImage: true } }
            }
        });
    }

    static async updateReportStatus(id, { status, resolution, reviewedBy, resolutionNotes }) {
        return prisma.report.update({
            where: { id: parseInt(id) },
            data: {
                status,
                resolution,
                reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
                reviewedAt: new Date(),
                resolutionNotes
            }
        });
    }

    // --- Mutes ---
    static async createMute(muterId, mutedUserId, expiresAt = null) {
        return prisma.userMute.upsert({
            where: {
                muterId_mutedUserId: {
                    muterId: parseInt(muterId),
                    mutedUserId: parseInt(mutedUserId)
                }
            },
            create: {
                muterId: parseInt(muterId),
                mutedUserId: parseInt(mutedUserId),
                expiresAt: expiresAt ? new Date(expiresAt) : null
            },
            update: {
                expiresAt: expiresAt ? new Date(expiresAt) : null
            }
        });
    }

    static async deleteMute(muterId, mutedUserId) {
        return prisma.userMute.deleteMany({
            where: {
                muterId: parseInt(muterId),
                mutedUserId: parseInt(mutedUserId)
            }
        });
    }

    static async getMutedUsers(muterId) {
        return prisma.userMute.findMany({
            where: { muterId: parseInt(muterId) },
            include: {
                mutedUser: { select: { id: true, name: true, email: true, profileImage: true, bio: true } }
            }
        });
    }

    static async isUserMuted(muterId, mutedUserId) {
        const mute = await prisma.userMute.findFirst({
            where: {
                muterId: parseInt(muterId),
                mutedUserId: parseInt(mutedUserId),
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            }
        });
        return !!mute;
    }

    // --- User Restrictions & Bans ---
    static async restrictUser(userId, { restrictionType, reason, expiresAt, createdBy }) {
        const [restriction] = await Promise.all([
            prisma.userRestriction.create({
                data: {
                    userId: parseInt(userId),
                    restrictionType,
                    reason,
                    expiresAt: expiresAt ? new Date(expiresAt) : null,
                    createdBy: createdBy ? parseInt(createdBy) : null
                }
            }),
            prisma.user.update({
                where: { id: parseInt(userId) },
                data: {
                    isRestricted: true,
                    restrictionReason: reason
                }
            })
        ]);
        return restriction;
    }

    static async banUser(userId, reason) {
        return prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                isBanned: true,
                bannedAt: new Date(),
                banReason: reason
            }
        });
    }

    static async unbanUser(userId) {
        return prisma.user.update({
            where: { id: parseInt(userId) },
            data: {
                isBanned: false,
                bannedAt: null,
                banReason: null
            }
        });
    }

    static async getUserRestrictions(userId) {
        return prisma.userRestriction.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { createdAt: "desc" }
        });
    }

    // --- Content Moderation Logs ---
    static async createModerationLog(data) {
        return prisma.contentModerationLog.create({ data });
    }

    static async getModerationLogs({ limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma.contentModerationLog.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" }
            }),
            prisma.contentModerationLog.count()
        ]);
        return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // --- Suspicious Login Logs ---
    static async createSuspiciousLoginLog(data) {
        return prisma.suspiciousLoginLog.create({ data });
    }

    static async getSuspiciousLogins({ isFlagged, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (typeof isFlagged === "boolean") where.isFlagged = isFlagged;

        const [logins, total] = await Promise.all([
            prisma.suspiciousLoginLog.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" }
            }),
            prisma.suspiciousLoginLog.count({ where })
        ]);
        return { logins, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async resolveSuspiciousLogin(id, actionTaken) {
        return prisma.suspiciousLoginLog.update({
            where: { id: parseInt(id) },
            data: {
                isResolved: true,
                actionTaken
            }
        });
    }

    // --- Verification Requests ---
    static async createVerificationRequest(data) {
        return prisma.accountVerificationRequest.create({
            data,
            include: {
                user: { select: { id: true, name: true, email: true, profileImage: true } }
            }
        });
    }

    static async getVerificationRequests({ status, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) where.status = status;

        const [requests, total] = await Promise.all([
            prisma.accountVerificationRequest.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { id: true, name: true, email: true, profileImage: true, verificationStatus: true } }
                }
            }),
            prisma.accountVerificationRequest.count({ where })
        ]);
        return { requests, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async updateVerificationStatus(id, { status, reviewerNotes, reviewedBy, badgeType }) {
        const request = await prisma.accountVerificationRequest.update({
            where: { id: parseInt(id) },
            data: {
                status,
                reviewerNotes,
                reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
                reviewedAt: new Date()
            }
        });

        if (status === "VERIFIED") {
            await prisma.user.update({
                where: { id: request.userId },
                data: {
                    isVerified: true,
                    verificationStatus: "VERIFIED",
                    verificationBadgeType: badgeType || request.type || "BLUE_CHECK"
                }
            });
        } else if (status === "REJECTED") {
            await prisma.user.update({
                where: { id: request.userId },
                data: {
                    verificationStatus: "REJECTED"
                }
            });
        }

        return request;
    }

    // --- Moderation Appeals ---
    static async createAppeal(data) {
        return prisma.moderationAppeal.create({
            data,
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });
    }

    static async getAppeals({ status, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) where.status = status;

        const [appeals, total] = await Promise.all([
            prisma.moderationAppeal.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { id: true, name: true, email: true, isBanned: true, isRestricted: true } },
                    reviewer: { select: { id: true, name: true } }
                }
            }),
            prisma.moderationAppeal.count({ where })
        ]);
        return { appeals, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    static async updateAppealStatus(id, { status, reviewerNotes, reviewedBy }) {
        return prisma.moderationAppeal.update({
            where: { id: parseInt(id) },
            data: {
                status,
                reviewerNotes,
                reviewedBy: reviewedBy ? parseInt(reviewedBy) : null,
                reviewedAt: new Date()
            }
        });
    }

    // --- Audit Logs ---
    static async createAuditLog(data) {
        return prisma.auditLog.create({
            data,
            include: {
                user: { select: { id: true, name: true, email: true } }
            }
        });
    }

    static async getAuditLogs({ action, limit = 50, page = 1 }) {
        const skip = (page - 1) * limit;
        const where = {};
        if (action) where.action = action;

        const [logs, total] = await Promise.all([
            prisma.auditLog.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            }),
            prisma.auditLog.count({ where })
        ]);
        return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
    }

    // --- Community Guidelines ---
    static async getCommunityGuidelines() {
        return prisma.communityGuidelines.findMany({
            where: { isActive: true },
            orderBy: { id: "asc" }
        });
    }
}
