import apiClient from "../api/client";

/**
 * Frontend User Service abstraction (DIP & OCP).
 * Encapsulates user profile, friend interactions, and search API calls.
 */
export const userService = {
    async getUserProfile() {
        const response = await apiClient.get("/users/me");
        return response.data;
    },

    async getUserById(userId) {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    },

    async updateUserProfile(formData) {
        const response = await apiClient.put("/users/me", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    async sendFriendRequest(addresseeId) {
        const response = await apiClient.post("/friends/requests", { addresseeId });
        return response.data;
    },

    async respondToFriendRequest(requestId, action) {
        const response = await apiClient.put(`/friends/requests/${requestId}`, { action });
        return response.data;
    },

    async getFriends() {
        const response = await apiClient.get("/friends");
        return response.data;
    },

    async getPendingFriendRequests() {
        const response = await apiClient.get("/friends/requests/pending");
        return response.data;
    }
};
