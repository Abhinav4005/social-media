import { ModerationRepository } from "../repositories/moderation.repository.js";
import { prisma } from "../lib/prisma.js";

// Basic spam & toxicity pattern detectors
const TOXIC_PATTERNS = [
    /hate\s+speech/i,
    /kill\s+yourself/i,
    /scam\s+link/i,
    /buy\s+cheap\s+followers/i,
    /bit\.ly\/crypto/i,
    /telegram\.me\/scam/i
];

export class ModerationService {
    // --- Spam & Content Moderation Engine ---
    static scanContent(text, contentType, userId = null) {
        if (!text || typeof text !== "string") {
            return { isClean: true, toxicityScore: 0, spamScore: 0, flags: [] };
        }

        const flags = [];
        let spamScore = 0;
        let toxicityScore = 0;

        // Check toxic regex patterns
        for (const pattern of TOXIC_PATTERNS) {
            if (pattern.test(text)) {
                flags.push(`Matched toxic pattern: ${pattern}`);
                toxicityScore += 0.8;
            }
        }

        // Link spam detection (excessive URLs)
        const urlMatches = text.match(/https?:\/\/[^\s]+/g) || [];
        if (urlMatches.length >= 3) {
            flags.push("Excessive links detected");
            spamScore += 0.7;
        }

        // Repeated character / caps lock spam detection
        if (text.length > 20 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
            flags.push("Excessive uppercase (SHOUTING)");
            spamScore += 0.3;
        }

        const isFlagged = toxicityScore >= 0.5 || spamScore >= 0.5;

        if (isFlagged && userId) {
            ModerationRepository.createModerationLog({
                contentType,
                userId: parseInt(userId),
                flagReason: flags.join("; ") || "Automated spam heuristic threshold exceeded",
                toxicityScore,
                spamScore,
                actionTaken: toxicityScore >= 0.8 ? "FLAGGED_FOR_REVIEW" : "SPAM_WARNING"
            }).catch(err => console.error("Error logging content moderation:", err));
        }

        return {
            isClean: !isFlagged,
            toxicityScore,
            spamScore,
            flags
        };
    }

    // --- Suspicious Login Detection ---
    static async checkSuspiciousLogin(userId, { ipAddress, userAgent, location }) {
        if (!userId) return { isSuspicious: false };

        // Find previous logins
        const previousLogins = await prisma.suspiciousLoginLog.findMany({
            where: { userId: parseInt(userId) },
            take: 10,
            orderBy: { createdAt: "desc" }
        });

        let riskScore = 0;
        const reasons = [];

        if (previousLogins.length > 0) {
            const knownIps = previousLogins.map(l => l.ipAddress).filter(Boolean);
            if (ipAddress && !knownIps.includes(ipAddress)) {
                riskScore += 0.5;
                reasons.push("New IP address detected");
            }

            const knownLocations = previousLogins.map(l => l.location).filter(Boolean);
            if (location && knownLocations.length > 0 && !knownLocations.includes(location)) {
                riskScore += 0.4;
                reasons.push("New geographical location detected");
            }
        }

        const isFlagged = riskScore >= 0.5;

        const log = await ModerationRepository.createSuspiciousLoginLog({
            userId: parseInt(userId),
            ipAddress,
            userAgent,
            location,
            riskScore,
            isFlagged,
            actionTaken: isFlagged ? "SECURITY_ALERT_SENT" : "NORMAL_LOGIN"
        });

        return { isSuspicious: isFlagged, riskScore, reasons, logId: log.id };
    }

    // --- Reporting System ---
    static async submitReport(reporterId, { targetType, targetId, reason, description }) {
        let reportedUserId = null;

        // Resolve reportedUserId based on targetType
        if (targetType === "USER") {
            reportedUserId = parseInt(targetId);
        } else if (targetType === "POST") {
            const post = await prisma.post.findUnique({ where: { id: parseInt(targetId) } });
            if (post) reportedUserId = post.userId;
        } else if (targetType === "COMMENT") {
            const comment = await prisma.comment.findUnique({ where: { id: parseInt(targetId) } });
            if (comment) reportedUserId = comment.userId;
        } else if (targetType === "MARKETPLACE") {
            const listing = await prisma.marketplaceListing.findUnique({ where: { id: parseInt(targetId) } });
            if (listing) reportedUserId = listing.sellerId;
        }

        const report = await ModerationRepository.createReport({
            reporterId: parseInt(reporterId),
            targetType,
            targetId: parseInt(targetId),
            reportedUserId,
            reason,
            description,
            status: "PENDING"
        });

        // Auto audit log
        await ModerationRepository.createAuditLog({
            userId: parseInt(reporterId),
            action: "REPORT_RESOLVE",
            entityType: targetType,
            entityId: parseInt(targetId),
            details: `Report created for ${targetType} #${targetId} (Reason: ${reason})`
        }).catch(() => { });

        return report;
    }

    static async getReports(query) {
        return ModerationRepository.getReports(query);
    }

    static async resolveReport(reportId, adminId, { status, resolution, resolutionNotes }) {
        const report = await ModerationRepository.updateReportStatus(reportId, {
            status,
            resolution,
            reviewedBy: adminId,
            resolutionNotes
        });

        // Take automatic enforcement action if required
        if (resolution === "USER_BANNED" && report.reportedUserId) {
            await ModerationRepository.banUser(report.reportedUserId, `Banned via Report #${reportId}`);
        } else if (resolution === "USER_RESTRICTED" && report.reportedUserId) {
            await ModerationRepository.restrictUser(report.reportedUserId, {
                restrictionType: "NO_POSTING",
                reason: `Restricted via Report #${reportId}`,
                createdBy: adminId
            });
        } else if (resolution === "CONTENT_REMOVED") {
            if (report.targetType === "POST") {
                await prisma.post.delete({ where: { id: report.targetId } }).catch(() => { });
            } else if (report.targetType === "COMMENT") {
                await prisma.comment.delete({ where: { id: report.targetId } }).catch(() => { });
            }
        }

        // Log admin action
        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: "REPORT_RESOLVE",
            entityType: "REPORT",
            entityId: parseInt(reportId),
            details: `Report #${reportId} resolved as ${status} / ${resolution}`
        });

        return report;
    }

    // --- Mute / Block / Restrict ---
    static async muteUser(muterId, mutedUserId, expiresAt) {
        if (parseInt(muterId) === parseInt(mutedUserId)) {
            throw new Error("You cannot mute yourself");
        }
        return ModerationRepository.createMute(muterId, mutedUserId, expiresAt);
    }

    static async unmuteUser(muterId, mutedUserId) {
        return ModerationRepository.deleteMute(muterId, mutedUserId);
    }

    static async getMutedUsers(muterId) {
        return ModerationRepository.getMutedUsers(muterId);
    }

    static async adminRestrictUser(adminId, { userId, restrictionType, reason, expiresAt }) {
        const res = await ModerationRepository.restrictUser(userId, {
            restrictionType,
            reason,
            expiresAt,
            createdBy: adminId
        });

        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: "USER_RESTRICT",
            entityType: "USER",
            entityId: parseInt(userId),
            details: `Restricted user #${userId} with ${restrictionType}`
        });

        return res;
    }

    static async adminBanUser(adminId, { userId, reason }) {
        const res = await ModerationRepository.banUser(userId, reason);

        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: "USER_BAN",
            entityType: "USER",
            entityId: parseInt(userId),
            details: `Banned user #${userId}: ${reason}`
        });

        return res;
    }

    static async adminUnbanUser(adminId, userId) {
        const res = await ModerationRepository.unbanUser(userId);

        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: "USER_UNBAN",
            entityType: "USER",
            entityId: parseInt(userId),
            details: `Unbanned user #${userId}`
        });

        return res;
    }

    // --- Account Verification ---
    static async requestVerification(userId, { type, documentType, documentUrl }) {
        return ModerationRepository.createVerificationRequest({
            userId: parseInt(userId),
            type: type || "BLUE_CHECK",
            documentType,
            documentUrl,
            status: "PENDING"
        });
    }

    static async getVerificationRequests(query) {
        return ModerationRepository.getVerificationRequests(query);
    }

    static async processVerification(requestId, adminId, { status, reviewerNotes, badgeType }) {
        const res = await ModerationRepository.updateVerificationStatus(requestId, {
            status,
            reviewerNotes,
            reviewedBy: adminId,
            badgeType
        });

        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: status === "VERIFIED" ? "VERIFICATION_APPROVE" : "VERIFICATION_REJECT",
            entityType: "VERIFICATION_REQUEST",
            entityId: parseInt(requestId),
            details: `Verification Request #${requestId} ${status}`
        });

        return res;
    }

    // --- User Appeals ---
    static async submitAppeal(userId, { reportId, reason, evidence }) {
        return ModerationRepository.createAppeal({
            userId: parseInt(userId),
            reportId: reportId ? parseInt(reportId) : null,
            reason,
            evidence,
            status: "PENDING"
        });
    }

    static async getAppeals(query) {
        return ModerationRepository.getAppeals(query);
    }

    static async processAppeal(appealId, adminId, { status, reviewerNotes }) {
        const appeal = await ModerationRepository.updateAppealStatus(appealId, {
            status,
            reviewerNotes,
            reviewedBy: adminId
        });

        if (status === "APPROVED") {
            // Restore user access if appeal approved
            await ModerationRepository.unbanUser(appeal.userId);
            await prisma.user.update({
                where: { id: appeal.userId },
                data: { isRestricted: false, restrictionReason: null }
            });
        }

        await ModerationRepository.createAuditLog({
            userId: parseInt(adminId),
            action: status === "APPROVED" ? "APPEAL_APPROVE" : "APPEAL_REJECT",
            entityType: "APPEAL",
            entityId: parseInt(appealId),
            details: `Appeal #${appealId} ${status}`
        });

        return appeal;
    }

    // --- Audit Logs & Guidelines ---
    static async getAuditLogs(query) {
        return ModerationRepository.getAuditLogs(query);
    }

    static async getCommunityGuidelines() {
        let guidelines = await ModerationRepository.getCommunityGuidelines();
        if (guidelines.length === 0) {
            // Seed default community guidelines if empty
            guidelines = await prisma.communityGuidelines.createMany({
                data: [
                    {
                        title: "Respect and Civility",
                        category: "SAFETY",
                        content: "Treat all members of the SocialHub community with respect. Harassment, hate speech, bullying, and threats of violence are strictly prohibited.",
                        version: "1.0"
                    },
                    {
                        title: "Authenticity and Spam Prevention",
                        category: "INTEGRITY",
                        content: "Do not create deceptive accounts, post spam, spread scams, or manipulate platform metrics.",
                        version: "1.0"
                    },
                    {
                        title: "Content Standards & Copyright",
                        category: "LEGAL",
                        content: "Only post original content or content you have rights to share. Explicit nudity, extreme violence, and illegal activity are not permitted.",
                        version: "1.0"
                    },
                    {
                        title: "Account Security & Privacy",
                        category: "PRIVACY",
                        content: "Do not share personal private information of others (doxxing) or attempt unauthorized logins into other user accounts.",
                        version: "1.0"
                    }
                ]
            }).then(() => ModerationRepository.getCommunityGuidelines());
        }
        return guidelines;
    }
}
