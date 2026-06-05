import { NextRequest, NextResponse } from "next/server";
import { workflowService } from "@/services/workflow.service";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const result = await workflowService.listWorkflows(page, pageSize);

    return NextResponse.json({
      success: true,
      data: result.workflows,
      metadata: result.metadata,
    });
  } catch (error) {
    return errorHandler(error);
  }
}
