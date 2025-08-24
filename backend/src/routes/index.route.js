import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";
import notificationRoutes from "./notification.route.js";
import chatRoutes from "./chat.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/post", postRoutes);
router.use("/notification", notificationRoutes);
router.use("/chat", chatRoutes);

export default router;