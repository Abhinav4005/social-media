import { Router } from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { generatePostAI, generateListingAI, chatWithAIController, summarizePostAI, generateSmartReplyAI } from "../controllers/ai.controller.js";

const router = Router();

router.use(authenticateToken);

router.post("/generate-post", generatePostAI);
router.post("/generate-listing", generateListingAI);
router.post("/chat", chatWithAIController);
router.post("/summarize", summarizePostAI);
router.post("/smart-reply", generateSmartReplyAI);

export default router;
