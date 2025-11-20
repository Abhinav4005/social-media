import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { cancelFriendRequest, getFriendRequest, respondToFriendRequest, sendFriendRequest } from "../controllers/friendController.js";

const router = express.Router();

router.post("/request", authenticateToken, sendFriendRequest);

router.post("/respond", authenticateToken, respondToFriendRequest);

router.post("/cancel", authenticateToken, cancelFriendRequest);

router.get("/", authenticateToken, getFriendRequest);

export default router;