import { ModerationService } from "../services/moderation.service.js";
import { ModerationRepository } from "../repositories/moderation.repository.js";

// --- Report Handlers ---
export const createReport = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetType, targetId, reason, description } = req.body;

        if (!targetType || !targetId || !reason) {
            return res.status(400).json({ success: false, message: "targetType, targetId, and reason are required." });
        }

        const report = await ModerationService.submitReport(userId, { targetType, targetId, reason, description });
        return res.status(201).json({ success: true, message: "Report submitted successfully.", data: report });
    } catch (error) {
        console.error("createReport error:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to submit report." });
    }
};

export const getReports = async (req, res) => {
    try {
        const { status, targetType, limit, page } = req.query;
        const result = await ModerationService.getReports({
            status,
            targetType,
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("getReports error:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch reports." });
    }
};

export const resolveReport = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const { status, resolution, resolutionNotes } = req.body;

        const report = await ModerationService.resolveReport(id, adminId, { status, resolution, resolutionNotes });
        return res.status(200).json({ success: true, message: "Report resolved.", data: report });
    } catch (error) {
        console.error("resolveReport error:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to resolve report." });
    }
};

// --- Mute / Unmute Handlers ---
export const muteUser = async (req, res) => {
    try {
        const muterId = req.user.id;
        const { mutedUserId, expiresAt } = req.body;

        if (!mutedUserId) {
            return res.status(400).json({ success: false, message: "mutedUserId is required." });
        }

        const mute = await ModerationService.muteUser(muterId, mutedUserId, expiresAt);
        return res.status(200).json({ success: true, message: "User muted successfully.", data: mute });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message || "Failed to mute user." });
    }
};

export const unmuteUser = async (req, res) => {
    try {
        const muterId = req.user.id;
        const { userId } = req.params;

        await ModerationService.unmuteUser(muterId, userId);
        return res.status(200).json({ success: true, message: "User unmuted successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to unmute user." });
    }
};

export const getMutedUsers = async (req, res) => {
    try {
        const muterId = req.user.id;
        const mutes = await ModerationService.getMutedUsers(muterId);
        return res.status(200).json({ success: true, data: mutes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch muted users." });
    }
};

// --- Admin Restrictions / Bans ---
export const restrictUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { userId, restrictionType, reason, expiresAt } = req.body;

        const result = await ModerationService.adminRestrictUser(adminId, { userId, restrictionType, reason, expiresAt });
        return res.status(200).json({ success: true, message: "User restricted.", data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to restrict user." });
    }
};

export const banUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { userId, reason } = req.body;

        const result = await ModerationService.adminBanUser(adminId, { userId, reason });
        return res.status(200).json({ success: true, message: "User banned.", data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to ban user." });
    }
};

export const unbanUser = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { userId } = req.params;

        const result = await ModerationService.adminUnbanUser(adminId, userId);
        return res.status(200).json({ success: true, message: "User unbanned.", data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to unban user." });
    }
};

// --- Content Scan & Suspicious Login Handlers ---
export const scanContent = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const { text, contentType } = req.body;
        const scanResult = ModerationService.scanContent(text, contentType || "POST", userId);
        return res.status(200).json({ success: true, data: scanResult });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to scan content." });
    }
};

export const checkLoginSecurity = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.body.userId;
        const { ipAddress, userAgent, location } = req.body;

        const result = await ModerationService.detectSuspiciousLogin(userId, { ipAddress, userAgent, location });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to check login security." });
    }
};

// --- Verification Handlers ---
export const requestVerification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type, documentType, documentUrl } = req.body;

        const request = await ModerationService.requestVerification(userId, { type, documentType, documentUrl });
        return res.status(201).json({ success: true, message: "Verification request submitted.", data: request });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to submit verification request." });
    }
};

export const getVerificationRequests = async (req, res) => {
    try {
        const { status, limit, page } = req.query;
        const result = await ModerationService.getVerificationRequests({
            status,
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch verification requests." });
    }
};

export const processVerification = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const { status, reviewerNotes, badgeType } = req.body;

        const result = await ModerationService.processVerification(id, adminId, { status, reviewerNotes, badgeType });
        return res.status(200).json({ success: true, message: `Verification request ${status}.`, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to process verification." });
    }
};

// --- User Appeals Handlers ---
export const submitAppeal = async (req, res) => {
    try {
        const userId = req.user.id;
        const { reportId, reason, evidence } = req.body;

        const appeal = await ModerationService.submitAppeal(userId, { reportId, reason, evidence });
        return res.status(201).json({ success: true, message: "Appeal submitted successfully.", data: appeal });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to submit appeal." });
    }
};

export const getAppeals = async (req, res) => {
    try {
        const { status, limit, page } = req.query;
        const result = await ModerationService.getAppeals({
            status,
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch appeals." });
    }
};

export const processAppeal = async (req, res) => {
    try {
        const adminId = req.user.id;
        const { id } = req.params;
        const { status, reviewerNotes } = req.body;

        const result = await ModerationService.processAppeal(id, adminId, { status, reviewerNotes });
        return res.status(200).json({ success: true, message: `Appeal ${status}.`, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Failed to process appeal." });
    }
};

// --- Audit Logs, Moderation Logs & Guidelines ---
export const getAuditLogs = async (req, res) => {
    try {
        const { action, limit, page } = req.query;
        const result = await ModerationService.getAuditLogs({
            action,
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch audit logs." });
    }
};

export const getModerationLogs = async (req, res) => {
    try {
        const { limit, page } = req.query;
        const result = await ModerationRepository.getModerationLogs({
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch content moderation logs." });
    }
};

export const getSuspiciousLogins = async (req, res) => {
    try {
        const { isFlagged, limit, page } = req.query;
        const result = await ModerationRepository.getSuspiciousLogins({
            isFlagged: isFlagged === "true" ? true : isFlagged === "false" ? false : undefined,
            limit: limit ? parseInt(limit) : 50,
            page: page ? parseInt(page) : 1
        });
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch suspicious logins." });
    }
};

export const getCommunityGuidelines = async (req, res) => {
    try {
        const guidelines = await ModerationService.getCommunityGuidelines();
        return res.status(200).json({ success: true, data: guidelines });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to fetch community guidelines." });
    }
};
