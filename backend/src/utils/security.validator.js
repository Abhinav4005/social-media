/**
 * Security Input Validator & Sanitizer.
 * Protects domain services against invalid types, parameter pollution, XSS payloads, and malformed IDs.
 */

export class SecurityValidator {
    /**
     * Validate and normalize email strings.
     * @param {string} email 
     * @returns {string}
     */
    static validateEmail(email) {
        if (!email || typeof email !== "string") {
            throw { status: 400, message: "Email must be a non-empty string" };
        }
        const trimmed = email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmed)) {
            throw { status: 400, message: "Invalid email format" };
        }
        return trimmed;
    }

    /**
     * Validate password complexity.
     * @param {string} password 
     * @returns {string}
     */
    static validatePassword(password) {
        if (!password || typeof password !== "string" || password.length < 6) {
            throw { status: 400, message: "Password must be at least 6 characters long" };
        }
        return password;
    }

    /**
     * Validate integer route/query parameter.
     * @param {any} value 
     * @param {string} paramName 
     * @returns {number}
     */
    static validateId(value, paramName = "ID") {
        const parsed = parseInt(value, 10);
        if (isNaN(parsed) || parsed <= 0) {
            throw { status: 400, message: `${paramName} must be a valid positive integer` };
        }
        return parsed;
    }

    /**
     * Sanitize text input strings to prevent dangerous script injection.
     * @param {string} text 
     * @returns {string}
     */
    static sanitizeString(text) {
        if (typeof text !== "string") return "";
        return text
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .trim();
    }
}
