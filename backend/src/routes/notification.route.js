import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getNotifications);

router.put("/markAsRead", authenticateToken, markNotificationAsRead);

export default router;