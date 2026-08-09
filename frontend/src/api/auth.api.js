import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const signUp = async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGN_UP, userData);
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign Up failed");
    }
    return response.data;
};

export const signIn = async (data) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.SIGN_IN, data);
    if (!response.data.user) {
        throw new Error(response.data.message || "Sign In failed");
    }
    return response.data;
};

export const logout = async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {});
    if (response.status !== 200) {
        throw new Error("Logout failed");
    }
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    if (response.status !== 200) {
        throw new Error("failed to forgot password");
    }
    return response.data;
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        token,
        newPassword,
        confirmPassword
    });
    if (response.status !== 200) {
        throw new Error("Failed to reset password");
    }
    return response.data;
};

export const refreshToken = async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {});
    return response.data;
};
