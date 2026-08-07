import rateLimit from "express-rate-limit";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Dedicated Rate Limiting Middleware for Auth Operations (Signup, Password Resets).
 * Prevents account creation spam, automated enumeration, and mailbombing.
 */
export const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        return ApiResponse.error(res, "Too many authentication requests from this IP. Please try again in 15 minutes.", 429);
    },
});

export default authLimit;
