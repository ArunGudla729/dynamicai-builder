import { WorkflowConfig } from "@/types";
import { prisma } from "@/lib/prisma";
import { notificationService } from "./notification.service";

export class WorkflowService {
  /**
   * Create workflow from configuration
   */
  async createWorkflow(name: string, description: string | undefined, config: WorkflowConfig) {
    try {
      const workflow = await prisma.workflow.create({
        data: {
          name,
          description,
          event: config.event,
          config: config as any,
          isActive: true,
        },
      });

      return workflow;
    } catch (error: any) {
      throw new Error(`Failed to create workflow: ${error.message}`);
    }
  }

  /**
   * Execute workflow based on event
   */
  async executeWorkflow(event: string, payload: any) {
    try {
      // Find all active workflows for this event
      const workflows = await prisma.workflow.findMany({
        where: {
          event,
          isActive: true,
        },
      });

      if (workflows.length === 0) {
        return { executed: 0 };
      }

      const results = await Promise.allSettled(
        workflows.map((workflow) => this.executeWorkflowActions(workflow, payload))
      );

      return {
        executed: results.filter((r) => r.status === "fulfilled").length,
        failed: results.filter((r) => r.status === "rejected").length,
      };
    } catch (error: any) {
      console.error("Workflow execution error:", error);
      throw new Error(`Failed to execute workflow: ${error.message}`);
    }
  }

  /**
   * Execute individual workflow actions
   */
  private async executeWorkflowActions(workflow: any, payload: any) {
    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId: workflow.id,
        status: "pending",
        input: payload,
      },
    });

    try {
      const config = workflow.config as WorkflowConfig;

      // Check conditions if any
      if (config.conditions && !this.checkConditions(config.conditions, payload)) {
        await prisma.workflowExecution.update({
          where: { id: execution.id },
          data: {
            status: "skipped",
            completedAt: new Date(),
            output: { reason: "Conditions not met" },
          },
        });
        return;
      }

      // Execute actions
      const actionResults = [];
      for (const action of config.actions) {
        const result = await this.executeAction(action, payload);
        actionResults.push(result);
      }

      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "completed",
          completedAt: new Date(),
          output: { results: actionResults },
        },
      });

      return actionResults;
    } catch (error: any) {
      await prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          error: error.message,
        },
      });

      throw error;
    }
  }

  /**
   * Execute single action
   */
  private async executeAction(action: any, payload: any) {
    switch (action.type) {
      case "send_email":
        return this.sendEmail(action.config, payload);
      case "create_notification":
        return this.createNotification(action.config, payload);
      case "webhook":
        return this.callWebhook(action.config, payload);
      case "custom":
        return this.executeCustomAction(action.config, payload);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Check workflow conditions
   */
  private checkConditions(conditions: any[], payload: any): boolean {
    return conditions.every((condition) => {
      const fieldValue = this.getNestedValue(payload, condition.field);
      const conditionValue = condition.value;

      switch (condition.operator) {
        case "eq":
          return fieldValue === conditionValue;
        case "neq":
          return fieldValue !== conditionValue;
        case "gt":
          return fieldValue > conditionValue;
        case "lt":
          return fieldValue < conditionValue;
        case "gte":
          return fieldValue >= conditionValue;
        case "lte":
          return fieldValue <= conditionValue;
        case "contains":
          return String(fieldValue).includes(conditionValue);
        case "in":
          return Array.isArray(conditionValue) && conditionValue.includes(fieldValue);
        default:
          return false;
      }
    });
  }

  /**
   * Get nested value from object
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  /**
   * Send email action
   */
  private async sendEmail(config: any, payload: any) {
    // Placeholder for email sending logic
    console.log("Sending email:", config, payload);
    return { success: true, action: "send_email" };
  }

  /**
   * Create notification action
   */
  private async createNotification(config: any, payload: any) {
    if (!payload.userId) {
      throw new Error("userId is required for notification");
    }

    await notificationService.create({
      userId: payload.userId,
      type: config.type || "info",
      title: config.title || "Notification",
      message: config.message || "You have a new notification",
      data: payload,
    });

    return { success: true, action: "create_notification" };
  }

  /**
   * Call webhook action
   */
  private async callWebhook(config: any, payload: any) {
    if (!config.url) {
      throw new Error("Webhook URL is required");
    }

    const response = await fetch(config.url, {
      method: config.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...config.headers,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    return { success: true, action: "webhook", status: response.status };
  }

  /**
   * Execute custom action
   */
  private async executeCustomAction(config: any, payload: any) {
    // Placeholder for custom action logic
    console.log("Executing custom action:", config, payload);
    return { success: true, action: "custom" };
  }

  /**
   * Get workflow by ID
   */
  async getWorkflow(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
      include: {
        executions: {
          take: 10,
          orderBy: { startedAt: "desc" },
        },
      },
    });
  }

  /**
   * List workflows
   */
  async listWorkflows(page: number = 1, pageSize: number = 10) {
    const skip = (page - 1) * pageSize;

    const [workflows, total] = await Promise.all([
      prisma.workflow.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { executions: true },
          },
        },
      }),
      prisma.workflow.count(),
    ]);

    return {
      workflows,
      metadata: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }
}

export const workflowService = new WorkflowService();
