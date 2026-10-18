import rateLimit from "express-rate-limit";

// Rate limiter for reporting content or users (max 10 reports per 15 minutes)
export const reportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Too many reports submitted from this IP. Please try again later." }
});

// Rate limiter for verification applications (max 3 per hour)
export const verificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Verification request rate limit reached. Please try again in an hour." }
});

// Rate limiter for submitting appeals (max 5 per day)
export const appealLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: "Appeal submission limit reached for today." }
});
