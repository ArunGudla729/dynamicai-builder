import { prisma } from "@/lib/prisma";
import { CreateEntityDto, UpdateEntityDto, CreateRecordDto, QueryRecordsDto } from "@/dto/entity.dto";

export class EntityRepository {
  async create(data: CreateEntityDto) {
    return prisma.entity.create({
      data,
      include: {
        configuration: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.entity.findUnique({
      where: { id },
      include: {
        configuration: true,
        _count: {
          select: { records: true },
        },
      },
    });
  }

  async findByConfigurationId(configurationId: string) {
    return prisma.entity.findMany({
      where: { configurationId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { records: true },
        },
      },
    });
  }

  async findByName(configurationId: string, name: string) {
    return prisma.entity.findUnique({
      where: {
        configurationId_name: {
          configurationId,
          name,
        },
      },
    });
  }

  async update(id: string, data: UpdateEntityDto) {
    return prisma.entity.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.entity.delete({
      where: { id },
    });
  }

  // Record operations
  async createRecord(data: CreateRecordDto) {
    return prisma.record.create({
      data,
    });
  }

  async findRecordById(id: string) {
    return prisma.record.findUnique({
      where: { id },
      include: {
        entity: true,
      },
    });
  }

  async queryRecords(entityId: string, query: QueryRecordsDto) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where: any = { entityId };

    // Apply filters if provided
    if (query.filters && Object.keys(query.filters).length > 0) {
      // Filter on JSON data field
      where.data = {
        path: [],
        equals: query.filters,
      };
    }

    const [records, total] = await Promise.all([
      prisma.record.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: query.sortBy
          ? {
              [query.sortBy]: query.sortOrder || "asc",
            }
          : { createdAt: "desc" },
      }),
      prisma.record.count({ where }),
    ]);

    return { records, total };
  }

  async updateRecord(id: string, data: any) {
    return prisma.record.update({
      where: { id },
      data: { data },
    });
  }

  async deleteRecord(id: string) {
    return prisma.record.delete({
      where: { id },
    });
  }

  async bulkCreateRecords(entityId: string, records: any[]) {
    return prisma.record.createMany({
      data: records.map((data) => ({
        entityId,
        data,
      })),
    });
  }
}

export const entityRepository = new EntityRepository();
