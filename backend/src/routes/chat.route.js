import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { addMemberToRoom, createRoom, getRooms } from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/create/room", authenticateToken, createRoom);

router.get("/rooms", authenticateToken, getRooms);

router.post("/add/member", authenticateToken, addMemberToRoom);

export default router;