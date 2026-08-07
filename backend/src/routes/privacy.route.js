import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    addListMember,
    blockUser,
    createPrivacyList,
    deletePrivacyList,
    getBlockedUsers,
    getPrivacyLists,
    getPrivacySettings,
    removeListMember,
    unblockUser,
    updatePrivacySettings
} from "../controllers/privacy.controller.js";

const router = express.Router();

// Block / Unblock endpoints
router.post("/block", authenticateToken, blockUser);
router.post("/block/:userId", authenticateToken, blockUser);
router.delete("/block/:userId", authenticateToken, unblockUser);
router.post("/unblock/:userId", authenticateToken, unblockUser);
router.get("/blocked", authenticateToken, getBlockedUsers);

// Privacy Settings
router.get("/settings", authenticateToken, getPrivacySettings);
router.put("/settings", authenticateToken, updatePrivacySettings);

// Custom Privacy Lists
router.get("/lists", authenticateToken, getPrivacyLists);
router.post("/lists", authenticateToken, createPrivacyList);
router.delete("/lists/:listId", authenticateToken, deletePrivacyList);
router.post("/lists/:listId/members", authenticateToken, addListMember);
router.delete("/lists/:listId/members/:memberId", authenticateToken, removeListMember);

export default router;
