import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { followUser, getFollowers, getFollowing, getUserFeed, getUserProfile, searchUsersByQuery, updateUserProfile } from "../controllers/user.controller.js";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/profile/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10* 1024* 1024},
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        if (!allowedTypes.test(file.mimetype)) {
            return cb(new Error("File type not allowed"), false);
        }
        cb(null, true);
    }
})

const router = express.Router();

router.get("/profile", authenticateToken, getUserProfile);

router.put("/profile/update", upload.fields([{ name: 'profileImage' }]), authenticateToken, updateUserProfile);

router.get("/search", authenticateToken, searchUsersByQuery);

router.post("/follow", authenticateToken, followUser);

router.get("/followers", authenticateToken, getFollowers);

router.get("/following", authenticateToken, getFollowing);

router.get("/feed", authenticateToken, getUserFeed);

export default router;