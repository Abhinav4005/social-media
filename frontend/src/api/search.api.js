import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const globalSearch = async (search, type = 'all', limit = 10, page = 1) => {
    const response = await apiClient.get(API_ENDPOINTS.SEARCH.GLOBAL, {
        params: { search, type, limit, page }
    });
    if (response.status !== 200) {
        throw new Error("Failed to perform global search");
    }
    return response.data.data || { users: [], posts: [] };
};
