import { defaultNotificationService } from "../services/notification.service.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await defaultNotificationService.getNotifications(req.user.id);
        const message = notifications.length ? "Notifications retrieved successfully" : "No notifications found";
        return ApiResponse.success(res, { notifications }, message, 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error retrieving notifications:", error);
        return next(error);
    }
};

export const markNotificationAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id || req.body?.notificationId || req.query?.notificationId;
        const notification = await defaultNotificationService.markNotificationAsRead(req.user.id, notificationId);
        return ApiResponse.success(res, { notification }, "Notification marked as read successfully", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error marking notification as read:", error);
        return next(error);
    }
};

export const markAllNotificationsAsRead = async (req, res, next) => {
    try {
        const notifications = await defaultNotificationService.getNotifications(req.user.id);
        const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;
        if (unreadCount === 0) {
            return ApiResponse.success(res, null, "No unread notifications to update", 200);
        }
        await defaultNotificationService.markAllAsRead(req.user.id);
        return ApiResponse.success(res, null, "All notifications marked as read", 200);
    } catch (error) {
        if (error.status) return ApiResponse.error(res, error.message, error.status);
        console.error("Error marking all notifications as read:", error);
        return next(error);
    }
};