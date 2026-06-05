import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const searchParams = req.nextUrl.searchParams;
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const notifications = await notificationService.getByUserId(session.user.id, {
      unreadOnly,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
