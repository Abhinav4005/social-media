import { defaultAuthService } from "../services/auth.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from "../middleware/authenticateToken.js";

export const signUp = async (req, res, next) => {
    try {
        const result = await defaultAuthService.signUp(req.body);

        if (result.token) {
            res.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
        }

        const { token: _omit, ...safeResult } = result;
        return ApiResponse.success(res, safeResult, "User created successfully", 201);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error("Error creating user:", error);
        return next(error);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const result = await defaultAuthService.signIn(req.body);

        if (result.token) {
            res.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
        }

        const { token: _omit, ...safeResult } = result;
        return ApiResponse.success(res, safeResult, "Login successful", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error("Error during sign in:", error);
        return next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const reset = await defaultAuthService.forgotPassword(req.body);
        return ApiResponse.success(res, { reset }, "Password reset link sent successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error("Error in forgot password: ", error);
        return next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const result = await defaultAuthService.resetPassword(req.body);
        return ApiResponse.success(res, result, "Password reset successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error("Error in resetting password: ", error);
        return next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        res.clearCookie(AUTH_COOKIE_NAME, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
            path: "/",
        });
        return ApiResponse.success(res, null, "Logout successful", 200);
    } catch (error) {
        console.error("Error during logout:", error);
        return next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const result = await defaultAuthService.refreshToken(userId);

        if (result.token) {
            res.cookie(AUTH_COOKIE_NAME, result.token, AUTH_COOKIE_OPTIONS);
        }

        const { token: _omit, ...safeResult } = result;
        return ApiResponse.success(res, safeResult, "Token refreshed successfully", 200);
    } catch (error) {
        if (error.status) {
            return ApiResponse.error(res, error.message, error.status);
        }
        console.error("Error refreshing token:", error);
        return next(error);
    }
};
