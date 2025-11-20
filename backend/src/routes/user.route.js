import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { followUser, getAllPhotosOfUser, getFollowers, getFollowing, getUserById, getUserFeed, getUserProfile, searchUsersByQuery, updateUserProfile } from "../controllers/user.controller.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);

router.get("/profile/:userId", authenticateToken, getUserById);

router.put("/profile/update", upload.fields([{ name: 'profileImage' }, { name: 'coverImage' }]), authenticateToken, updateUserProfile);

router.get("/search", authenticateToken, searchUsersByQuery);

router.post("/follow", authenticateToken, followUser);

router.get("/followers", authenticateToken, getFollowers);

router.get("/following", authenticateToken, getFollowing);

router.get("/feed", authenticateToken, getUserFeed);

router.get("/photos", authenticateToken, getAllPhotosOfUser);

export default router;