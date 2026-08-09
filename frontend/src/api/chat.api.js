import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const getRooms = async () => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.ROOMS);
    if (response.status !== 200) {
        throw new Error("Failed to fetch chat rooms");
    }
    return response.data.rooms || [];
};

export const createOrGetRoom = async (name = null, type, memberIds = []) => {
    const response = await apiClient.post(API_ENDPOINTS.CHAT.CREATE_ROOM, {
        name,
        type,
        memberIds
    });
    if (![200, 201].includes(response.status)) {
        throw new Error("Failed to create or get chat room");
    }
    return response.data.room || [];
};

export const getMessages = async (roomId) => {
    const response = await apiClient.get(API_ENDPOINTS.CHAT.MESSAGES(roomId));
    if (response.status !== 200) {
        throw new Error("Failed to fetch messages");
    }
    return response.data.messages || [];
};

export const deleteMessage = async (messageId) => {
    const response = await apiClient.delete(API_ENDPOINTS.CHAT.DELETE_MESSAGE(messageId));
    if (response.status !== 200) {
        throw new Error("Failed to delete message");
    }
    return response.data;
};
