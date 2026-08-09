import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const updateUserProfile = async (userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USER.UPDATE, userData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    });
    if (response.status !== 200) {
        throw new Error("Failed to update user profile");
    }
    return response.data;
};

export const getUserProfile = async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile");
    }
    return response.data.user;
};

export const getUserById = async ({ userId }) => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PROFILE_BY_ID(userId));
    if (response.status !== 200) {
        throw new Error("Failed to fetch user profile by ID");
    }
    return response.data.user;
};

export const getUserPosts = async () => {
    const response = await apiClient.get(API_ENDPOINTS.POSTS.BY_USER);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user posts");
    }
    return response.data.posts || [];
};

export const followUser = async (followingId) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.FOLLOW, { followingId });
    if (response.status !== 200) {
        throw new Error("Failed to follow/unfollow user");
    }
    return response.data;
};

export const getUserFollowers = async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.FOLLOWERS);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user followers");
    }
    return response.data.followers || [];
};

export const getUserFollowing = async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.FOLLOWING);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user following");
    }
    return response.data.following || [];
};

export const getAllPhotosOfUser = async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.PHOTOS);
    if (response.status !== 200) {
        throw new Error("Failed to fetch user photos");
    }
    return response.data || { userImage: [], postImages: [] };
};
