import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { addMemberToRoom, changeGroupName, createRoom, deleteMessage, getMessages, getRooms } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create/room", authenticateToken, createRoom);

router.get("/rooms", authenticateToken, getRooms);

router.post("/add/member", authenticateToken, addMemberToRoom);

router.get("/room/:roomId/messages", authenticateToken, getMessages);

router.patch("/room/update", authenticateToken, changeGroupName);

router.delete("/message/:messageId/delete", authenticateToken, deleteMessage);

export default router;