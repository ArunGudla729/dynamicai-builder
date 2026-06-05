import { prisma } from "@/lib/prisma";

export interface CreateNotificationDto {
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  data?: any;
}

export class NotificationService {
  /**
   * Create a new notification
   */
  async create(data: CreateNotificationDto) {
    return prisma.notification.create({
      data,
    });
  }

  /**
   * Get user notifications
   */
  async getByUserId(userId: string, options?: { unreadOnly?: boolean; limit?: number }) {
    const where: any = { userId };
    if (options?.unreadOnly) {
      where.isRead = false;
    }

    return prisma.notification.findMany({
      where,
      take: options?.limit || 50,
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string) {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  /**
   * Mark all user notifications as read
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  /**
   * Delete notification
   */
  async delete(id: string) {
    return prisma.notification.delete({
      where: { id },
    });
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }
}

export const notificationService = new NotificationService();
