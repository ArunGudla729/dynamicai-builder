import { NextRequest, NextResponse } from "next/server";
import { notificationService } from "@/services/notification.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    await notificationService.delete(params.id);

    return NextResponse.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
