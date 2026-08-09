import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { addMemberToRoom, changeGroupName, createRoom, deleteMessage, getMessages, getRooms } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/rooms", authenticateToken, getRooms);

router.post("/rooms", authenticateToken, createRoom);
router.post("/create/room", authenticateToken, createRoom);
router.get("/rooms/:roomId/messages", authenticateToken, getMessages);
router.get("/room/:roomId/messages", authenticateToken, getMessages);
router.post("/rooms/:roomId/members", authenticateToken, addMemberToRoom);
router.put("/rooms/:roomId/name", authenticateToken, changeGroupName);
router.delete("/messages/:messageId", authenticateToken, deleteMessage);
router.delete("/message/:messageId/delete", authenticateToken, deleteMessage);

export default router;
