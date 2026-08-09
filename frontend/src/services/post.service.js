import apiClient from "../api/client";

export const postService = {
    async createPost(formData) {
        const response = await apiClient.post("/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    async updatePost(postId, formData) {
        const response = await apiClient.put(`/posts/${postId}`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    async getPostById(postId) {
        const response = await apiClient.get(`/posts/${postId}`);
        return response.data;
    },

    async deletePost(postId) {
        const response = await apiClient.delete(`/posts/${postId}`);
        return response.data;
    },

    async getPostFeed(page = 1, limit = 10) {
        const response = await apiClient.get(`/posts/feed?page=${page}&limit=${limit}`);
        return response.data;
    },

    async commentOnPost(postId, content, parentId = null) {
        const response = await apiClient.post(`/posts/${postId}/comments`, { content, parentId });
        return response.data;
    },

    async reactOnPost(postId, status) {
        const response = await apiClient.post(`/posts/${postId}/likes`, { status });
        return response.data;
    },

    async bookmarkPost(postId) {
        const response = await apiClient.post(`/posts/${postId}/bookmarks`);
        return response.data;
    }
};
