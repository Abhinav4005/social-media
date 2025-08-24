import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { addMemberToRoom, createRoom, getMessages, getRooms } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create/room", authenticateToken, createRoom);

router.get("/rooms", authenticateToken, getRooms);

router.post("/add/member", authenticateToken, addMemberToRoom);

router.get("/rooms/:roomId/messages", authenticateToken, getMessages);

export default router;