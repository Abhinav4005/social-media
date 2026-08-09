import apiClient from "../api/client";

export const privacyService = {
    async blockUser(userId) {
        const response = await apiClient.post(`/privacy/block/${userId}`);
        return response.data;
    },

    async unblockUser(userId) {
        const response = await apiClient.delete(`/privacy/block/${userId}`);
        return response.data;
    },

    async getBlockedUsers() {
        const response = await apiClient.get("/privacy/blocked");
        return response.data;
    },

    async getPrivacySettings() {
        const response = await apiClient.get("/privacy/settings");
        return response.data;
    },

    async updatePrivacySettings(settingsData) {
        const response = await apiClient.put("/privacy/settings", settingsData);
        return response.data;
    },

    async getPrivacyLists() {
        const response = await apiClient.get("/privacy/lists");
        return response.data;
    },

    async createPrivacyList(name) {
        const response = await apiClient.post("/privacy/lists", { name });
        return response.data;
    },

    async deletePrivacyList(listId) {
        const response = await apiClient.delete(`/privacy/lists/${listId}`);
        return response.data;
    },

    async addListMember(listId, memberId) {
        const response = await apiClient.post(`/privacy/lists/${listId}/members`, { memberId });
        return response.data;
    },

    async removeListMember(listId, memberId) {
        const response = await apiClient.delete(`/privacy/lists/${listId}/members/${memberId}`);
        return response.data;
    }
};
