import apiClient from "./client";
import { API_ENDPOINTS } from "../constant/apiEndpoints";

export const getNotifications = async () => {
    const response = await apiClient.get(API_ENDPOINTS.NOTIFICATIONS.GET_ALL);
    if (response.status !== 200) {
        throw new Error("Failed to fetch notifications");
    }
    return response.data.notifications || [];
};

export const markAllNotificationsAsRead = async () => {
    const response = await apiClient.put("/notifications/read-all");
    if (response.status !== 200) {
        throw new Error("Failed to mark notifications as read");
    }
    return response.data;
};
