import { NextRequest, NextResponse } from "next/server";
import { projectRepository } from "@/repositories/project.repository";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";
import { NotFoundError } from "@/types";
import { auditLogService } from "@/services/audit-log.service";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth();

    const project = await projectRepository.findById(params.id);
    if (!project) {
      throw new NotFoundError("Project");
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const project = await projectRepository.update(params.id, body);

    await auditLogService.log({
      userId: session.user.id,
      action: "update",
      resource: "project",
      resourceId: project.id,
      metadata: body,
    });

    return NextResponse.json({
      success: true,
      data: project,
      message: "Project updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await requireAuth();

    await projectRepository.delete(params.id);

    await auditLogService.log({
      userId: session.user.id,
      action: "delete",
      resource: "project",
      resourceId: params.id,
    });

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
