/**
 * Enterprise Generic API Response Envelope.
 * Standardizes response structures across all HTTP endpoints for future scalability & API versioning.
 */
export class ApiResponse {
    /**
     * Send a standardized success response.
     * @param {Object} res - Express response object
     * @param {any} data - Response payload
     * @param {string} message - Human-readable success message
     * @param {number} statusCode - HTTP Status code (default 200)
     * @param {Object} [meta] - Optional pagination or metadata
     */
    static success(res, data = null, message = "Success", statusCode = 200, meta = null) {
        const payload = {
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        };

        if (meta) {
            payload.meta = meta;
        }

        // Backward compatibility for existing frontends directly inspecting root fields (e.g., data.token, data.user)
        if (data && typeof data === "object" && !Array.isArray(data)) {
            Object.assign(payload, data);
        }

        return res.status(statusCode).json(payload);
    }

    /**
     * Send a standardized error response.
     * @param {Object} res - Express response object
     * @param {string} message - Error message
     * @param {number} statusCode - HTTP Status code (default 500)
     * @param {any} [errors] - Optional error details array/object
     */
    static error(res, message = "An error occurred", statusCode = 500, errors = null) {
        const payload = {
            success: false,
            message,
            error: message, // Legacy compatibility
            errors: errors || null,
            data: null,
            timestamp: new Date().toISOString(),
        };

        return res.status(statusCode).json(payload);
    }

    /**
     * Send a standardized paginated response.
     * @param {Object} res - Express response object
     * @param {Array} items - Page items
     * @param {number} page - Current page number
     * @param {number} limit - Limit per page
     * @param {number} total - Total records count
     * @param {string} message - Success message
     */
    static paginate(res, items = [], page = 1, limit = 10, total = 0, message = "Data retrieved successfully") {
        const totalPages = Math.ceil(total / limit) || 1;
        return this.success(
            res,
            items,
            message,
            200,
            { page: Number(page), limit: Number(limit), total: Number(total), totalPages }
        );
    }
}

