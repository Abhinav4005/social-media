/**
 * Custom Operational API Error Class extending native Error.
 * Standardizes HTTP status codes, error messages, stack traces, and operational error flags.
 * Fulfills Single Responsibility Principle (SRP).
 */
export class ApiError extends Error {
    /**
     * @param {number} statusCode - HTTP status code (e.g., 400, 401, 403, 404, 500)
     * @param {string} message - Human readable error message
     * @param {any} [errors] - Optional error details array or object
     * @param {string} [stack] - Optional stack trace override
     */
    constructor(statusCode, message = "An error occurred", errors = [], stack = "") {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = Number(statusCode) || 500;
        this.status = this.statusCode; // Compatibility getter
        this.success = false;
        this.errors = errors;
        this.isOperational = true;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

    static badRequest(message = "Bad Request", errors = []) {
        return new ApiError(400, message, errors);
    }

    static unauthorized(message = "Unauthorized access", errors = []) {
        return new ApiError(401, message, errors);
    }

    static forbidden(message = "Access forbidden", errors = []) {
        return new ApiError(403, message, errors);
    }

    static notFound(message = "Resource not found", errors = []) {
        return new ApiError(404, message, errors);
    }

    static internal(message = "Internal Server Error", errors = []) {
        return new ApiError(500, message, errors);
    }
}
