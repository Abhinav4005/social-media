import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const createStory = async (formData) => {
    const response = await apiClient.post(API_ENDPOINTS.STORIES.BASE, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    if (![200, 201].includes(response.status)) {
        throw new Error("Failed to create story");
    }
    return response.data;
};

export const getStories = async () => {
    const response = await apiClient.get(API_ENDPOINTS.STORIES.BASE);
    if (response.status !== 200) {
        throw new Error("Failed to fetch stories");
    }
    return response.data?.feed || response.data?.data?.feed || [];
};

export const markStorySeen = async (storyId) => {
    const response = await apiClient.post(API_ENDPOINTS.STORIES.MARK_SEEN(storyId));
    return response.data;
};
