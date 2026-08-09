import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const sendFriendRequest = async (addresseeId) => {
    const response = await apiClient.post(API_ENDPOINTS.FRIENDS.SEND_REQUEST, {}, {
        params: { addresseeId }
    });
    if (response.status !== 201) {
        throw new Error("Failed to send friend request");
    }
};

export const cancelFriendRequest = async (requestId) => {
    const response = await apiClient.post(API_ENDPOINTS.FRIENDS.CANCEL_REQUEST, {}, {
        params: { requestId }
    });
    if (response.status !== 200) {
        throw new Error("Failed to cancel friend request");
    }
    return response.data;
};

export const getFriendRequests = async () => {
    const response = await apiClient.get(API_ENDPOINTS.FRIENDS.REQUESTS);
    if (response.status !== 200) {
        throw new Error("Failed to fetch friend requests");
    }
    return response.data || [];
};

export const respondToFriendRequest = async (requestId, action) => {
    const response = await apiClient.post(API_ENDPOINTS.FRIENDS.RESPOND, {}, {
        params: { requestId, action }
    });
    if (response.status !== 200) {
        throw new Error("Failed to respond to friend request");
    }
    return response.data;
};
