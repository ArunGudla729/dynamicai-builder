import { z } from "zod";

// Field validation schema
export const fieldConfigSchema = z.object({
  name: z.string().min(1, "Field name is required"),
  type: z.enum([
    "text",
    "email",
    "password",
    "number",
    "date",
    "datetime",
    "textarea",
    "select",
    "multiselect",
    "checkbox",
    "radio",
    "switch",
    "file",
    "image",
    "url",
    "tel",
    "color",
    "range",
    "json",
  ]),
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  validation: z.array(z.any()).optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.union([z.string(), z.number()]),
      }).passthrough()
    )
    .optional(),
  defaultValue: z.any().optional(),
  hidden: z.boolean().optional(),
  disabled: z.boolean().optional(),
  description: z.string().optional(),
}).passthrough(); // Allow additional properties

// App config schema
export const appConfigSchema = z.object({
  entity: z.string().min(1, "Entity name is required"),
  displayName: z.string().optional(),
  fields: z.array(fieldConfigSchema).min(1, "At least one field is required"),
  actions: z.union([
    z.array(z.string()),
    z.record(z.any()), // More lenient - accepts any object structure
  ]).optional(),
  workflows: z.array(z.any()).optional(),
}).passthrough(); // Allow additional properties

// Column config schema
export const columnConfigSchema = z.object({
  key: z.string().min(1, "Column key is required"),
  label: z.string().min(1, "Column label is required"),
  type: z.string().optional(),
  sortable: z.boolean().optional(),
  filterable: z.boolean().optional(),
  hidden: z.boolean().optional(),
  width: z.union([z.number(), z.string()]).optional(),
  render: z.string().optional(),
}).passthrough(); // Allow additional properties

// Table config schema
export const tableConfigSchema = z.object({
  entity: z.string().min(1, "Entity name is required"),
  columns: z.array(columnConfigSchema).min(1, "At least one column is required"),
  actions: z.union([
    z.array(z.any()),
    z.record(z.any()), // More lenient - accepts any object structure
  ]).optional(),
  filters: z.array(z.any()).optional(),
  searchable: z.boolean().optional(),
  sortable: z.boolean().optional(),
  pagination: z
    .object({
      pageSize: z.number().positive(),
      pageSizeOptions: z.array(z.number()).optional(),
    })
    .optional(),
  exportable: z.boolean().optional(),
}).passthrough(); // Allow additional properties

// Chart config schema
export const chartConfigSchema = z.object({
  type: z.enum(["line", "bar", "pie", "area", "scatter", "radar"]),
  dataKey: z.string().optional(),
  xAxisKey: z.string().optional(),
  yAxisKey: z.string().optional(),
  colors: z.array(z.string()).optional(),
  data: z.array(z.any()).optional(),
}).passthrough(); // Allow additional properties

// Widget config schema
export const widgetConfigSchema = z.object({
  id: z.string().min(1, "Widget ID is required"),
  type: z.string(), // Accept any string type to be more flexible
  title: z.string().min(1, "Widget title is required"),
  data: z.any().optional(),
  config: z.any().optional(),
  position: z
    .object({
      x: z.number(),
      y: z.number(),
      w: z.number(),
      h: z.number(),
    })
    .optional(),
}).passthrough(); // Allow additional properties

// Dashboard config schema
export const dashboardConfigSchema = z.object({
  title: z.string().optional(), // Make title optional for more flexibility
  widgets: z.array(widgetConfigSchema).min(1, "At least one widget is required"),
  layout: z.any().optional(), // Accept any layout format (string or object)
}).passthrough(); // Allow additional properties

// Workflow config schema
export const workflowConfigSchema = z.object({
  event: z.string().min(1, "Event is required"),
  actions: z
    .array(
      z.object({
        type: z.string(), // Accept any string type for flexibility
        config: z.record(z.any()),
      }).passthrough()
    )
    .min(1, "At least one action is required"),
  conditions: z
    .array(
      z.object({
        field: z.string(),
        operator: z.string(), // Accept any string operator for flexibility
        value: z.any(),
      }).passthrough()
    )
    .optional(),
}).passthrough(); // Allow additional properties

// Project schema
export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
});

// Configuration schema
export const configurationSchema = z.object({
  projectId: z.string().cuid("Invalid project ID"),
  name: z.string().min(1, "Configuration name is required"),
  type: z.enum(["form", "table", "dashboard", "workflow"]),
  config: z.any(),
  isActive: z.boolean().optional(),
});

// User registration schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// CSV import schema
export const csvImportSchema = z.object({
  file: z.any(),
  entity: z.string().min(1, "Entity is required"),
  mappings: z.record(z.string()).optional(),
});

// Validation helper functions
export function validateConfig(type: string, config: any) {
  const schemas: Record<string, z.ZodSchema> = {
    form: appConfigSchema,
    table: tableConfigSchema,
    dashboard: dashboardConfigSchema,
    workflow: workflowConfigSchema,
  };

  const schema = schemas[type];
  if (!schema) {
    throw new Error(`Unknown configuration type: ${type}`);
  }

  return schema.parse(config);
}

export function safeValidateConfig(type: string, config: any) {
  try {
    return {
      success: true,
      data: validateConfig(type, config),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof z.ZodError ? error.errors : error,
    };
  }
}
