import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Express Middleware attaching generic response helper methods directly to `res`.
 * Provides ergonomic API response capability (`res.success`, `res.error`, `res.paginate`).
 */
export const responseMiddleware = (req, res, next) => {
    res.success = (data = null, message = "Success", statusCode = 200, meta = null) => {
        return ApiResponse.success(res, data, message, statusCode, meta);
    };

    res.error = (message = "An error occurred", statusCode = 500, errors = null) => {
        return ApiResponse.error(res, message, statusCode, errors);
    };

    res.paginate = (items = [], page = 1, limit = 10, total = 0, message = "Data retrieved successfully") => {
        return ApiResponse.paginate(res, items, page, limit, total, message);
    };

    next();
};
