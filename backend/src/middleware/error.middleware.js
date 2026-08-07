import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

/**
 * Global Centralized Express Error Middleware for Production Readiness.
 * Ensures consistent JSON error responses, logs errors, and handles ApiError instances seamlessly.
 */
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || err.status || 500;
    const isProduction = process.env.NODE_ENV === "production";

    if (err instanceof ApiError) {
        console.warn(`[ApiError] ${req.method} ${req.url} (${err.statusCode}):`, err.message);
        return ApiResponse.error(res, err.message, err.statusCode, err.errors);
    }

    console.error(`[Error] ${req.method} ${req.url}:`, {
        message: err.message,
        stack: isProduction ? undefined : err.stack,
    });

    const message = isProduction && statusCode === 500 ? "Internal server error" : (err.message || "An error occurred");
    const errors = isProduction ? null : (err.errors || (err.stack ? { stack: err.stack } : null));

    return ApiResponse.error(res, message, statusCode, errors);
};


