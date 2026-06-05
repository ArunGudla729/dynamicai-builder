import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";
import { dynamicTableService } from "@/services/dynamic-table.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { entityId: string } }
) {
  try {
    await requireAuth();

    const result = await dynamicTableService.exportToCSV(params.entityId, {
      page: 1,
      pageSize: 10000,
    });

    if (!result) {
      return NextResponse.json(
        { success: false, error: "No data to export" },
        { status: 404 }
      );
    }

    return new NextResponse(result.data, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
