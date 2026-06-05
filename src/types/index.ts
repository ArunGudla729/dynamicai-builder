// Core Types
export interface AppConfig {
  entity: string;
  displayName?: string;
  fields: FieldConfig[];
  actions?: string[];
  workflows?: WorkflowConfig[];
}

export interface FieldConfig {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
  defaultValue?: any;
  hidden?: boolean;
  disabled?: boolean;
  description?: string;
}

export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "date"
  | "datetime"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "radio"
  | "switch"
  | "file"
  | "image"
  | "url"
  | "tel"
  | "color"
  | "range"
  | "json";

export interface ValidationRule {
  type: "min" | "max" | "pattern" | "custom" | "email" | "url" | "minLength" | "maxLength";
  value?: any;
  message?: string;
}

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface WorkflowConfig {
  event: string;
  actions: WorkflowAction[];
  conditions?: WorkflowCondition[];
}

export interface WorkflowAction {
  type: "send_email" | "create_notification" | "webhook" | "custom";
  config: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains" | "in";
  value: any;
}

// Table Types
export interface TableConfig {
  entity: string;
  columns: ColumnConfig[];
  actions?: TableAction[];
  filters?: FilterConfig[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: PaginationConfig;
  exportable?: boolean;
}

export interface ColumnConfig {
  key: string;
  label: string;
  type?: FieldType;
  sortable?: boolean;
  filterable?: boolean;
  hidden?: boolean;
  width?: number | string;
  render?: string; // Custom render function name
}

export interface TableAction {
  type: "view" | "edit" | "delete" | "custom";
  label: string;
  icon?: string;
  handler?: string;
}

export interface FilterConfig {
  field: string;
  type: "text" | "select" | "date" | "daterange" | "number";
  label: string;
  options?: SelectOption[];
}

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions?: number[];
}

// Dashboard Types
export interface DashboardConfig {
  title: string;
  widgets: WidgetConfig[];
  layout?: LayoutConfig;
}

export interface WidgetConfig {
  id: string;
  type: "kpi" | "chart" | "table" | "metric" | "stat";
  title: string;
  data?: any;
  config?: ChartConfig | MetricConfig;
  position?: WidgetPosition;
}

export interface ChartConfig {
  type: "line" | "bar" | "pie" | "area" | "scatter" | "radar";
  dataKey?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  colors?: string[];
}

export interface MetricConfig {
  value: number | string;
  trend?: number;
  trendDirection?: "up" | "down" | "neutral";
  format?: "number" | "currency" | "percentage";
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LayoutConfig {
  cols: number;
  rowHeight: number;
  gap: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: ResponseMetadata;
}

export interface ResponseMetadata {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  metadata: Required<ResponseMetadata>;
}

// Permission Types
export interface Permission {
  resource: string;
  action: "create" | "read" | "update" | "delete" | "manage";
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// User Types
export interface User {
  id: string;
  name?: string | null;
  email: string;
  image?: string | null;
  role?: Role | null;
}

// Notification Types
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

// CSV Import Types
export interface CSVImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: CSVError[];
}

export interface CSVError {
  row: number;
  field?: string;
  message: string;
  data?: any;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

// Configuration Types
export interface ProjectConfig {
  id: string;
  name: string;
  description?: string;
  version: number;
  configurations: Configuration[];
}

export interface Configuration {
  id: string;
  name: string;
  type: "form" | "table" | "dashboard" | "workflow";
  config: AppConfig | TableConfig | DashboardConfig | WorkflowConfig;
  isActive: boolean;
}

// Error Types
export class AppError extends Error {
  public code: string;
  public statusCode: number;
  public details?: any;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    details?: any
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, "VALIDATION_ERROR", 400, details);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}
