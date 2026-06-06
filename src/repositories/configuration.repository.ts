import { prisma } from "@/lib/prisma";
import { CreateConfigurationDto, UpdateConfigurationDto } from "@/dto/project.dto";

export class ConfigurationRepository {
  async create(data: CreateConfigurationDto) {
    return prisma.configuration.create({
      data,
      include: {
        project: true,
        entities: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.configuration.findUnique({
      where: { id },
      include: {
        project: true,
        entities: true,
      },
    });
  }

  async findAll() {
    return prisma.configuration.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        entities: true,
      },
    });
  }

  async findByProject(projectId: string) {
    return prisma.configuration.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        project: true,
        entities: true,
      },
    });
  }

  async findByProjectId(projectId: string) {
    return prisma.configuration.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        entities: true,
      },
    });
  }

  async findByType(projectId: string, type: string) {
    return prisma.configuration.findMany({
      where: { projectId, type },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(id: string, data: UpdateConfigurationDto) {
    // Increment version on update
    const current = await prisma.configuration.findUnique({
      where: { id },
      select: { version: true },
    });

    return prisma.configuration.update({
      where: { id },
      data: {
        ...data,
        version: current ? current.version + 1 : 1,
      },
      include: {
        project: true,
        entities: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.configuration.delete({
      where: { id },
    });
  }

  async toggleActive(id: string, isActive: boolean) {
    return prisma.configuration.update({
      where: { id },
      data: { isActive },
    });
  }
}

export const configurationRepository = new ConfigurationRepository();
