import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { createStory, getStories, markStorySeen } from "../controllers/story.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.fields([{ name: "media" }]), authenticateToken, createStory);
router.get("/", authenticateToken, getStories);
router.post("/:id/views", authenticateToken, markStorySeen);

export default router;