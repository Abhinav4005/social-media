/**
 * Frontend Custom ApiError Class extending Error.
 * Preserves HTTP status codes, server response envelopes, and error messages.
 */
export class ApiError extends Error {
    constructor(statusCode, message = "An error occurred", errors = []) {
        super(message);
        this.name = "ApiError";
        this.statusCode = Number(statusCode) || 500;
        this.errors = errors;
    }

    static fromAxiosError(error, defaultMessage = "An unexpected error occurred") {
        const statusCode = error?.response?.status || 500;
        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            defaultMessage;
        const errors = error?.response?.data?.errors || [];

        return new ApiError(statusCode, message, errors);
    }
}
