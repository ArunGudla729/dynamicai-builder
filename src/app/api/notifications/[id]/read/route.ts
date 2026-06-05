import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    await notificationService.markAsRead(params.id);

    return NextResponse.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
