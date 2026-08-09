import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { cancelFriendRequest, getFriends, getPendingRequests, respondToFriendRequest, sendFriendRequest } from "../controllers/friendController.js";

const router = express.Router();

router.get("/", authenticateToken, (req, res, next) => {
    return getFriends(req, res, next);
});
router.get("/requests/pending", authenticateToken, getPendingRequests);
router.post("/requests", authenticateToken, sendFriendRequest);
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/cancel", authenticateToken, cancelFriendRequest);
router.post("/respond", authenticateToken, respondToFriendRequest);
router.put("/requests/:id", authenticateToken, respondToFriendRequest);
router.delete("/requests/:id", authenticateToken, cancelFriendRequest);

export default router;
