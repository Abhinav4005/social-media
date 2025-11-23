import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { createStory, getStories } from "../controllers/story.controller.js";

const router = express.Router();

router.post("/create", authenticateToken, createStory);

router.get("/getUserStory", authenticateToken, getStories);

export default router;