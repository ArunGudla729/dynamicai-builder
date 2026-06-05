import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function PUT(req: NextRequest) {
  try {
    const session = await requireAuth();

    await notificationService.markAllAsRead(session.user.id);

    return NextResponse.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
