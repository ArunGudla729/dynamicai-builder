import { NextRequest, NextResponse } from "next/server";
import { configurationRepository } from "@/repositories/configuration.repository";
import { requireAuth } from "@/middleware/auth";
import { validateBody } from "@/middleware/validator";
import { configurationSchema, validateConfig } from "@/validations/config.validation";
import { errorHandler } from "@/middleware/error-handler";
import { dynamicFormService } from "@/services/dynamic-form.service";
import { auditLogService } from "@/services/audit-log.service";

export async function GET(req: NextRequest) {
  try {
    await requireAuth();
    
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    const type = searchParams.get("type");

    let configurations;
    if (projectId) {
      configurations = await configurationRepository.findByProject(projectId);
    } else {
      configurations = await configurationRepository.findAll();
    }

    // Filter by type if specified
    if (type && configurations) {
      configurations = configurations.filter((c: any) => c.type === type);
    }

    return NextResponse.json({
      success: true,
      data: configurations || [],
    });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("=== Configuration Create Request ===");
    const session = await requireAuth();
    console.log("Session:", session.user.id);
    
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const data = validateBody(configurationSchema, body);
    console.log("Data validated:", data.type);

    // Validate configuration based on type
    console.log("Validating config for type:", data.type);
    validateConfig(data.type, data.config);
    console.log("Config validation passed");

    console.log("Creating configuration in database...");
    const configuration = await configurationRepository.create(data);
    console.log("Configuration created:", configuration.id);

    // Generate entities for form configurations
    if (data.type === "form") {
      console.log("Generating form entity...");
      await dynamicFormService.generateForm(data.config, configuration.id);
      console.log("Form entity generated");
    }

    console.log("Creating audit log...");
    await auditLogService.log({
      userId: session.user.id,
      action: "create",
      resource: "configuration",
      resourceId: configuration.id,
      metadata: { type: data.type, name: data.name },
    });
    console.log("Audit log created");

    return NextResponse.json(
      {
        success: true,
        data: configuration,
        message: "Configuration created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("=== Configuration Create Error ===");
    console.error("Error details:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return errorHandler(error);
  }
}
