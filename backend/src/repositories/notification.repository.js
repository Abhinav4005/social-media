import { prisma } from "../lib/prisma.js";

/**
 * Notification Repository isolating DB persistence queries for notifications.
 * Fulfills SRP & DIP.
 */
export class NotificationRepository {
    constructor(db = prisma) {
        this.db = db;
    }

    async getNotifications(userId, limit = 50) {
        return await this.db.notification.findMany({
            where: { receiverId: userId },
            orderBy: { createdAt: "desc" },
            include: {
                sender: {
                    select: { id: true, name: true, profileImage: true }
                }
            },
            take: limit,
        });
    }

    async markAsRead(notificationId, userId) {
        return await this.db.notification.update({
            where: { id: parseInt(notificationId, 10), receiverId: userId },
            data: { read: true }
        });
    }
}

export const defaultNotificationRepository = new NotificationRepository();
