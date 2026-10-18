import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import {
    reportLimiter,
    verificationLimiter,
    appealLimiter
} from "../middleware/safetyRateLimiter.middleware.js";
import {
    createReport,
    getReports,
    resolveReport,
    muteUser,
    unmuteUser,
    getMutedUsers,
    restrictUser,
    banUser,
    unbanUser,
    scanContent,
    checkLoginSecurity,
    requestVerification,
    getVerificationRequests,
    processVerification,
    submitAppeal,
    getAppeals,
    processAppeal,
    getAuditLogs,
    getModerationLogs,
    getSuspiciousLogins,
    getCommunityGuidelines
} from "../controllers/moderation.controller.js";

const router = express.Router();

// --- Public / Community Guidelines ---
router.get("/community-guidelines", getCommunityGuidelines);

// --- Content Scan & Security Checks ---
router.post("/scan", authenticateToken, scanContent);
router.post("/check-login", checkLoginSecurity);

// --- User Reporting ---
router.post("/reports", authenticateToken, reportLimiter, createReport);

// --- User Muting ---
router.post("/mute", authenticateToken, muteUser);
router.delete("/mute/:userId", authenticateToken, unmuteUser);
router.get("/muted", authenticateToken, getMutedUsers);

// --- Account Verification (User side) ---
router.post("/verification", authenticateToken, verificationLimiter, requestVerification);

// --- Appeals (User side) ---
router.post("/appeals", authenticateToken, appealLimiter, submitAppeal);

// --- Admin Moderation Queue & Operations ---
router.get("/admin/reports", authenticateToken, adminAuth, getReports);
router.put("/admin/reports/:id", authenticateToken, adminAuth, resolveReport);

router.post("/admin/restrict", authenticateToken, adminAuth, restrictUser);
router.post("/admin/ban", authenticateToken, adminAuth, banUser);
router.post("/admin/unban/:userId", authenticateToken, adminAuth, unbanUser);

router.get("/admin/verification", authenticateToken, adminAuth, getVerificationRequests);
router.put("/admin/verification/:id", authenticateToken, adminAuth, processVerification);

router.get("/admin/appeals", authenticateToken, adminAuth, getAppeals);
router.put("/admin/appeals/:id", authenticateToken, adminAuth, processAppeal);

router.get("/admin/audit-logs", authenticateToken, adminAuth, getAuditLogs);
router.get("/admin/content-logs", authenticateToken, adminAuth, getModerationLogs);
router.get("/admin/suspicious-logins", authenticateToken, adminAuth, getSuspiciousLogins);

export default router;
