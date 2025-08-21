import express from "express";
import { signUp, signIn } from "../controllers/auth.controller.js";
import loginLimit from "../middleware/loginLimit.js";

const router = express.Router();

router.post("/signup", signUp);

router.post("/login", loginLimit, signIn);

export default router;