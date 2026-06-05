import { NextRequest, NextResponse } from "next/server";
import { projectRepository } from "@/repositories/project.repository";
import { requireAuth } from "@/middleware/auth";
import { validateBody } from "@/middleware/validator";
import { projectSchema } from "@/validations/config.validation";
import { errorHandler } from "@/middleware/error-handler";
import { auditLogService } from "@/services/audit-log.service";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const { projects, total } = await projectRepository.findByUserId(userId, {
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      data: projects,
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const userId = session.user.id;

    const body = await req.json();
    const data = validateBody(projectSchema, body);

    const project = await projectRepository.create(userId, data);

    await auditLogService.log({
      userId,
      action: "create",
      resource: "project",
      resourceId: project.id,
      metadata: { name: project.name },
    });

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
