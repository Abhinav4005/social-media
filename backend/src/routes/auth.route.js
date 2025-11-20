import express from "express";
import { signUp, signIn, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import loginLimit from "../middleware/loginLimit.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", loginLimit, signIn);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

export default router;