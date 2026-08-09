import rateLimit from "express-rate-limit";

/**
 * Global Rate Limiter protecting all API endpoints against DoS, scraping, and abuse.
 * Window: 15 minutes, Max: 150 requests per IP.
 */
const globalLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "production" ? 500 : 1500,
    message: {
        error: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

export default globalLimit;
