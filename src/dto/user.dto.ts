export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role?: {
    id: string;
    name: string;
    permissions: Array<{
      resource: string;
      action: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  image?: string;
  roleId?: string;
}
