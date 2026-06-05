import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "Administrator role with full access",
    },
  });

  const managerRole = await prisma.role.upsert({
    where: { name: "manager" },
    update: {},
    create: {
      name: "manager",
      description: "Manager role with limited access",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "Regular user role",
    },
  });

  // Create permissions
  const resources = ["project", "configuration", "entity", "record", "workflow", "user"];
  const actions = ["create", "read", "update", "delete", "manage"];

  for (const resource of resources) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action,
          },
        },
        update: {},
        create: {
          name: `${action}_${resource}`,
          resource,
          action,
          description: `Permission to ${action} ${resource}`,
        },
      });

      // Connect to admin role
      await prisma.role.update({
        where: { id: adminRole.id },
        data: {
          permissions: {
            connect: { id: permission.id },
          },
        },
      });

      // Connect some permissions to manager role
      if (["create", "read", "update"].includes(action)) {
        await prisma.role.update({
          where: { id: managerRole.id },
          data: {
            permissions: {
              connect: { id: permission.id },
            },
          },
        });
      }

      // Connect read permission to user role
      if (action === "read") {
        await prisma.role.update({
          where: { id: userRole.id },
          data: {
            permissions: {
              connect: { id: permission.id },
            },
          },
        });
      }
    }
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@dynamicai.com" },
    update: {},
    create: {
      email: "admin@dynamicai.com",
      name: "Admin User",
      password: hashedPassword,
      roleId: adminRole.id,
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
