import { ApiResponse } from "../utils/apiResponse.js";

/**
 * Lightweight Request Body & Query Validation Middleware.
 * Validates request payloads against rules before passing to controllers.
 * 
 * @param {Object} rules - Map of field names to validation functions/options.
 */
export const validatePayload = (rules = {}) => {
    return (req, res, next) => {
        const errors = [];
        const source = req.method === "GET" ? req.query : req.body;

        for (const [field, config] of Object.entries(rules)) {
            const value = source ? source[field] : undefined;

            if (config.required && (value === undefined || value === null || value === "")) {
                errors.push(`${field} is required`);
                continue;
            }

            if (value !== undefined && value !== null && value !== "") {
                if (config.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.push(`Invalid email format for ${field}`);
                }

                if (config.minLength && String(value).length < config.minLength) {
                    errors.push(`${field} must be at least ${config.minLength} characters long`);
                }

                if (config.maxLength && String(value).length > config.maxLength) {
                    errors.push(`${field} cannot exceed ${config.maxLength} characters`);
                }
            }
        }

        if (errors.length > 0) {
            return ApiResponse.error(res, errors[0], 400, errors);
        }

        next();
    };
};
