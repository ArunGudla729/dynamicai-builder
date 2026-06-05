export interface CreateProjectDto {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface ProjectResponseDto {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  configurationsCount?: number;
}

export interface CreateConfigurationDto {
  projectId: string;
  name: string;
  type: "form" | "table" | "dashboard" | "workflow";
  config: any;
  isActive?: boolean;
}

export interface UpdateConfigurationDto {
  name?: string;
  config?: any;
  isActive?: boolean;
}

export interface ConfigurationResponseDto {
  id: string;
  projectId: string;
  name: string;
  type: string;
  config: any;
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
