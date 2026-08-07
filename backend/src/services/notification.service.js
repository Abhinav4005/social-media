import { defaultNotificationRepository } from "../repositories/notification.repository.js";

/**
 * Notification Service managing business rules for notification delivery & read tracking.
 * Fulfills SRP & DIP.
 */
export class NotificationService {
    constructor(notificationRepository = defaultNotificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    async getNotifications(userId) {
        if (!userId) throw { status: 400, message: "User ID is required" };
        const notifications = await this.notificationRepository.getNotifications(userId);
        return notifications || [];
    }

    async markNotificationAsRead(userId, notificationId) {
        if (!userId || !notificationId) throw { status: 400, message: "User ID and Notification ID are required" };
        return await this.notificationRepository.markAsRead(notificationId, userId);
    }
}

export const defaultNotificationService = new NotificationService();
