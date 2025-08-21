import prisma from "../config/db.js";

export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                receiverId: userId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profileImage: true,
                    },
                },
            },
            take: 50, // Limit to the most recent 50 notifications
        });

        if (!notifications || notifications.length === 0) {
            return res.status(200).json({ message: "No notifications found", notifications: [] });
        }

        return res.status(200).json({ message: "Notifications retrieved successfully", notifications });

    } catch (error) {
        console.error("Error retrieving notifications:", error);
        return res.status(500).json({ error: "An error occurred while retrieving notifications" });
    }
}

export const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.body || req.query;

        if (!userId || !notificationId) {
            return res.status(400).json({ error: "User ID and Notification ID are required" });
        }

        const notification = await prisma.notification.updated({
            where: {
                id: notificationId,
                receiverId: userId,
            },
            data: {
                read: true,
            }
        })

        if (!notification) {
            return res.status(200).json({ error: "Notification not found", notification: null });
        }

        return res.status(200).json({ message: "Notification marked as read successfully", notification });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return res.status(500).json({ error: "An error occurred while marking notification as read" });
    }
}