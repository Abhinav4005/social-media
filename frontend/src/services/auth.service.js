import apiClient from "../api/client";

export const authService = {
    async signUp(name, email, password) {
        const response = await apiClient.post("/auth/signup", { name, email, password });
        return response.data;
    },

    async signIn(email, password) {
        const response = await apiClient.post("/auth/signin", { email, password });
        return response.data;
    },

    async forgotPassword(email) {
        const response = await apiClient.post("/auth/forgot-password", { email });
        return response.data;
    },

    async resetPassword(token, newPassword, confirmPassword) {
        const response = await apiClient.post("/auth/reset-password", { token, newPassword, confirmPassword });
        return response.data;
    },

    async logout() {
        const response = await apiClient.post("/auth/logout");
        return response.data;
    }
};
