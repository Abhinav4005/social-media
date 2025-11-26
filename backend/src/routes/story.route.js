import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { createStory, getStories } from "../controllers/story.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/create", upload.fields([{ name: "media"}, { name: "media"} ]), authenticateToken, createStory);

router.get("/getUserStory", authenticateToken, getStories);

export default router;