import { NextRequest, NextResponse } from "next/server";
import { entityRepository } from "@/repositories/entity.repository";
import { requireAuth } from "@/middleware/auth";
import { errorHandler } from "@/middleware/error-handler";
import { auditLogService } from "@/services/audit-log.service";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { entityId: string } }
) {
  try {
    await requireAuth();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const search = searchParams.get("search") || "";

    // Find the configuration and entity
    const configuration = await prisma.configuration.findFirst({
      where: {
        config: {
          path: ['entity'],
          equals: params.entityId,
        },
      },
    });

    if (!configuration) {
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      });
    }

    const entity = await prisma.entity.findFirst({
      where: {
        configurationId: configuration.id,
        name: params.entityId,
      },
    });

    if (!entity) {
      return NextResponse.json({
        success: true,
        data: [],
        metadata: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Query records
    const skip = (page - 1) * pageSize;

    const where: any = {
      entityId: entity.id,
    };

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.record.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: records,
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

export async function POST(
  req: NextRequest,
  { params }: { params: { entityId: string } }
) {
  try {
    const session = await requireAuth();
    const body = await req.json();

    // Find the configuration associated with this entity name
    const configuration = await prisma.configuration.findFirst({
      where: {
        config: {
          path: ['entity'],
          equals: params.entityId,
        },
      },
    });

    if (!configuration) {
      return NextResponse.json(
        {
          success: false,
          error: `No configuration found for entity: ${params.entityId}`,
        },
        { status: 404 }
      );
    }

    // Find or create the entity
    let entity = await prisma.entity.findFirst({
      where: {
        configurationId: configuration.id,
        name: params.entityId,
      },
    });

    if (!entity) {
      entity = await prisma.entity.create({
        data: {
          configurationId: configuration.id,
          name: params.entityId,
          displayName: params.entityId,
          schema: body.data,
        },
      });
    }

    // Create the record
    const record = await prisma.record.create({
      data: {
        id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        entityId: entity.id,
        data: body.data,
      },
    });

    await auditLogService.log({
      userId: session.user.id,
      action: "create",
      resource: "record",
      resourceId: record.id,
      metadata: { entityId: params.entityId },
    });

    return NextResponse.json(
      {
        success: true,
        data: record,
        message: "Record created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return errorHandler(error);
  }
}
