import api from "./client";

export const discoveryApi = {
    getPymk: async (limit = 10) => {
        const response = await api.get(`/discovery/pymk?limit=${limit}`);
        return response.data;
    },

    searchWithFilters: async (filters = {}) => {
        const params = new URLSearchParams();
        Object.keys(filters).forEach((key) => {
            if (filters[key] !== undefined && filters[key] !== "") {
                params.append(key, filters[key]);
            }
        });
        const response = await api.get(`/discovery/search?${params.toString()}`);
        return response.data;
    },

    recordPostView: async (postId) => {
        const response = await api.post("/discovery/view-history", { postId });
        return response.data;
    },

    getRecentlyViewed: async (limit = 20) => {
        const response = await api.get(`/discovery/recently-viewed?limit=${limit}`);
        return response.data;
    },

    clearViewHistory: async () => {
        const response = await api.delete("/discovery/recently-viewed");
        return response.data;
    },

    getNearbyContent: async (locationParams = {}) => {
        const params = new URLSearchParams(locationParams).toString();
        const response = await api.get(`/discovery/nearby?${params}`);
        return response.data;
    },

    getPersonalizedFeed: async (limit = 20) => {
        const response = await api.get(`/discovery/personalized?limit=${limit}`);
        return response.data;
    },

    getSerendipityFeed: async () => {
        const response = await api.get("/discovery/serendipity");
        return response.data;
    },

    getDaily5Feed: async () => {
        const response = await api.get("/discovery/daily-5");
        return response.data;
    },

    updateUserInterests: async (interests = []) => {
        const response = await api.post("/discovery/interests", { interests });
        return response.data;
    },
};

export default discoveryApi;
