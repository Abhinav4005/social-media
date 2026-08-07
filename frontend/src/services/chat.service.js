import apiClient from "../api/client";

/**
 * Frontend Chat Service abstraction (DIP & OCP).
 * Encapsulates rooms and chat message API calls.
 */
export const chatService = {
    async createRoom(type, name, memberIds) {
        const response = await apiClient.post("/chats/rooms", { type, name, memberIds });
        return response.data;
    },

    async getRooms() {
        const response = await apiClient.get("/chats/rooms");
        return response.data;
    },

    async getRoomMessages(roomId) {
        const response = await apiClient.get(`/chats/rooms/${roomId}/messages`);
        return response.data;
    },

    async uploadChatAttachment(file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await apiClient.post("/images", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }
};
