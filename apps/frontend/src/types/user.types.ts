export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  roleId: number;
}

export interface UpdateUserDto {
  username?: string;
  email?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface Role {
  id: number;
  name: string;
  permissions?: string[];
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  totalPages: number;
}