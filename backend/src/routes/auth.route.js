import express from "express";
import { signUp, signIn, forgotPassword, resetPassword, logout } from "../controllers/auth.controller.js";
import loginLimit from "../middleware/loginLimit.js";
import authenticateToken from "../middleware/authenticateToken.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", loginLimit, signIn);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);
router.post("/logout", authenticateToken, logout);

export default router;
