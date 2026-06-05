import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();

    const count = await notificationService.getUnreadCount(session.user.id);

    return NextResponse.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
