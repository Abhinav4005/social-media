import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import postRoutes from "./post.route.js";
import notificationRoutes from "./notification.route.js";
import chatRoutes from "./chat.route.js";
import friendRoutes from "./friend.route.js";
import globalRoutes from "./global.route.js";
import imageRoutes from "./image.route.js";
import storyRoutes from "./story.route.js";
import subscriptionRoute from "./stripe.route.js";
import privacyRoutes from "./privacy.route.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use(["/users", "/user"], userRoutes);
router.use(["/posts", "/post"], postRoutes);
router.use(["/notifications", "/notification"], notificationRoutes);
router.use(["/chats", "/chat"], chatRoutes);
router.use(["/friends", "/friend"], friendRoutes);
router.use("/global", globalRoutes);
router.use(["/images", "/image"], imageRoutes);
router.use(["/stories", "/story"], storyRoutes);
router.use(["/subscriptions", "/subscription"], subscriptionRoute);
router.use("/privacy", privacyRoutes);


export default router;