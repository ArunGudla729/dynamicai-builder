import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/validations/config.validation";
import { errorHandler } from "@/middleware/error-handler";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Get default user role
    const userRole = await prisma.role.findUnique({
      where: { name: "user" },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: userRole?.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: user,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
