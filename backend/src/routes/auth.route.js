import express from "express";
import { signUp, signIn, forgotPassword, resetPassword, logout, refreshToken } from "../controllers/auth.controller.js";
import loginLimit from "../middleware/loginLimit.js";
import authLimit from "../middleware/authLimit.js";
import authenticateToken from "../middleware/authenticateToken.js";
import { validatePayload } from "../middleware/validate.middleware.js";

const router = express.Router();

router.post(
    "/signup",
    authLimit,
    validatePayload({
        name: { required: true, minLength: 2 },
        email: { required: true, type: "email" },
        password: { required: true, minLength: 6 }
    }),
    signUp
);

router.post(
    "/login",
    loginLimit,
    validatePayload({
        email: { required: true, type: "email" },
        password: { required: true }
    }),
    signIn
);

router.post(
    "/forgot-password",
    authLimit,
    validatePayload({
        email: { required: true, type: "email" }
    }),
    forgotPassword
);

router.post(
    "/reset-password",
    authLimit,
    validatePayload({
        token: { required: true },
        newPassword: { required: true, minLength: 6 }
    }),
    resetPassword
);

router.post("/logout", authenticateToken, logout);
router.post("/refresh-token", authenticateToken, refreshToken);

export default router;

