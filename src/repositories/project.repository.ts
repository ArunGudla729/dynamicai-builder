import { prisma } from "@/lib/prisma";
import { CreateProjectDto, UpdateProjectDto } from "@/dto/project.dto";
import { Prisma } from "@prisma/client";

export class ProjectRepository {
  async create(userId: string, data: CreateProjectDto) {
    return prisma.project.create({
      data: {
        ...data,
        userId,
      },
      include: {
        configurations: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        configurations: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string, options?: { page?: number; pageSize?: number }) {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { userId },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { configurations: true },
          },
        },
      }),
      prisma.project.count({ where: { userId } }),
    ]);

    return { projects, total };
  }

  async update(id: string, data: UpdateProjectDto) {
    return prisma.project.update({
      where: { id },
      data,
      include: {
        configurations: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }

  async findPublicProjects(options?: { page?: number; pageSize?: number }) {
    const page = options?.page || 1;
    const pageSize = options?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: { isPublic: true },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          _count: {
            select: { configurations: true },
          },
        },
      }),
      prisma.project.count({ where: { isPublic: true } }),
    ]);

    return { projects, total };
  }
}

export const projectRepository = new ProjectRepository();
