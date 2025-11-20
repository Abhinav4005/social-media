import express from "express";
import { globalSearch } from "../controllers/globalSearch.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.get("/search", authenticateToken, globalSearch);

export default router;