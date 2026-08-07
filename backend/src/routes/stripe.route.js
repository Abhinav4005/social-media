import express from "express";
import { createCheckoutSession } from "../controllers/stripe.controller.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/create-checkout-session", authenticateToken, createCheckoutSession);

export default router;