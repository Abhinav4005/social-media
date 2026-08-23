import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import {
    createGroup,
    getGroupById,
    getUserGroups,
    discoverGroups,
    joinGroup,
    leaveGroup,
    updateGroup,
    deleteGroup,
    createGroupPost,
    getGroupPosts,
    getGroupMembers,
    removeGroupMember,
    updateMemberRole
} from "../controllers/group.controller.js";
import { validatePayload } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post(
    "/create",
    authenticateToken,
    validatePayload({ name: { required: true, minLength: 2 } }),
    createGroup
);

router.get("/my-groups", authenticateToken, getUserGroups);
router.get("/discover", authenticateToken, discoverGroups);
router.get("/:id", authenticateToken, getGroupById);
router.post("/:id/join", authenticateToken, joinGroup);
router.post("/:id/leave", authenticateToken, leaveGroup);
router.put("/:id", authenticateToken, updateGroup);
router.delete("/:id", authenticateToken, deleteGroup);

// Group Posts
router.post("/:id/posts", authenticateToken, createGroupPost);
router.get("/:id/posts", authenticateToken, getGroupPosts);

// Group Members Management
router.get("/:id/members", authenticateToken, getGroupMembers);
router.delete("/:id/members/:userId", authenticateToken, removeGroupMember);
router.patch("/:id/members/:userId/role", authenticateToken, updateMemberRole);

export default router;

