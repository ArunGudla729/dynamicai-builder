export interface CreateEntityDto {
  configurationId: string;
  name: string;
  displayName?: string;
  schema: any;
}

export interface UpdateEntityDto {
  name?: string;
  displayName?: string;
  schema?: any;
}

export interface EntityResponseDto {
  id: string;
  configurationId: string;
  name: string;
  displayName?: string;
  schema: any;
  createdAt: Date;
  updatedAt: Date;
  recordsCount?: number;
}

export interface CreateRecordDto {
  entityId: string;
  data: any;
}

export interface UpdateRecordDto {
  data: any;
}

export interface RecordResponseDto {
  id: string;
  entityId: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface QueryRecordsDto {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
  search?: string;
}
