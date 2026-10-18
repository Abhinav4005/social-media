import apiClient from "../api/client";

export const moderationService = {
    // Submit content or user report
    async submitReport({ targetType, targetId, reason, description }) {
        const response = await apiClient.post("/moderation/reports", {
            targetType,
            targetId,
            reason,
            description
        });
        return response.data;
    },

    // Mute / Unmute user
    async muteUser(mutedUserId, expiresAt = null) {
        const response = await apiClient.post("/moderation/mute", { mutedUserId, expiresAt });
        return response.data;
    },

    async unmuteUser(userId) {
        const response = await apiClient.delete(`/moderation/mute/${userId}`);
        return response.data;
    },

    async getMutedUsers() {
        const response = await apiClient.get("/moderation/muted");
        return response.data;
    },

    // Verification request
    async requestVerification({ type, documentType, documentUrl }) {
        const response = await apiClient.post("/moderation/verification", {
            type,
            documentType,
            documentUrl
        });
        return response.data;
    },

    // Appeal submission
    async submitAppeal({ reportId, reason, evidence }) {
        const response = await apiClient.post("/moderation/appeals", {
            reportId,
            reason,
            evidence
        });
        return response.data;
    },

    // Community guidelines
    async getCommunityGuidelines() {
        const response = await apiClient.get("/moderation/community-guidelines");
        return response.data;
    },

    // --- Admin Moderation Endpoints ---
    async adminGetReports(params = {}) {
        const response = await apiClient.get("/moderation/admin/reports", { params });
        return response.data;
    },

    async adminResolveReport(reportId, { status, resolution, resolutionNotes }) {
        const response = await apiClient.put(`/moderation/admin/reports/${reportId}`, {
            status,
            resolution,
            resolutionNotes
        });
        return response.data;
    },

    async adminRestrictUser({ userId, restrictionType, reason, expiresAt }) {
        const response = await apiClient.post("/moderation/admin/restrict", {
            userId,
            restrictionType,
            reason,
            expiresAt
        });
        return response.data;
    },

    async adminBanUser({ userId, reason }) {
        const response = await apiClient.post("/moderation/admin/ban", { userId, reason });
        return response.data;
    },

    async adminUnbanUser(userId) {
        const response = await apiClient.post(`/moderation/admin/unban/${userId}`);
        return response.data;
    },

    async adminGetVerificationRequests(params = {}) {
        const response = await apiClient.get("/moderation/admin/verification", { params });
        return response.data;
    },

    async adminProcessVerification(requestId, { status, reviewerNotes, badgeType }) {
        const response = await apiClient.put(`/moderation/admin/verification/${requestId}`, {
            status,
            reviewerNotes,
            badgeType
        });
        return response.data;
    },

    async adminGetAppeals(params = {}) {
        const response = await apiClient.get("/moderation/admin/appeals", { params });
        return response.data;
    },

    async adminProcessAppeal(appealId, { status, reviewerNotes }) {
        const response = await apiClient.put(`/moderation/admin/appeals/${appealId}`, {
            status,
            reviewerNotes
        });
        return response.data;
    },

    async adminGetAuditLogs(params = {}) {
        const response = await apiClient.get("/moderation/admin/audit-logs", { params });
        return response.data;
    },

    async adminGetModerationLogs(params = {}) {
        const response = await apiClient.get("/moderation/admin/content-logs", { params });
        return response.data;
    },

    async adminGetSuspiciousLogins(params = {}) {
        const response = await apiClient.get("/moderation/admin/suspicious-logins", { params });
        return response.data;
    }
};
