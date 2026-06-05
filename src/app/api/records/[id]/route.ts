import { NextRequest, NextResponse } from "next/server";
import { entityRepository } from "@/repositories/entity.repository";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";
import { NotFoundError } from "@/types";
import { auditLogService } from "@/services/audit-log.service";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth();

    const record = await entityRepository.findRecordById(params.id);
    if (!record) {
      throw new NotFoundError("Record");
    }

    return NextResponse.json({
      success: true,
      data: record,
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    const record = await entityRepository.updateRecord(params.id, body.data);

    await auditLogService.log({
      userId: session.user.id,
      action: "update",
      resource: "record",
      resourceId: params.id,
      metadata: body.data,
    });

    return NextResponse.json({
      success: true,
      data: record,
      message: "Record updated successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuth();

    await entityRepository.deleteRecord(params.id);

    await auditLogService.log({
      userId: session.user.id,
      action: "delete",
      resource: "record",
      resourceId: params.id,
    });

    return NextResponse.json({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    return errorHandler(error);
  }
}
