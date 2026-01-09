import type { User, CreateUserDto, UserListResponse, UpdateUserDto, Role } from "../types/user.types";
import api from "./api";

export const userService = {
  getUsers: async (page = 1, limit = 10, search?: string, isActive?: boolean):
    Promise<UserListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await api.get(`/users?${params.toString()}`);
    return response.data;
  },

  getUser: async (id: CreateUserDto): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  createUser: async (userData: CreateUserDto): Promise<User> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: UpdateUserDto): Promise<User> => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  toggleUserStatus: async (id: number): Promise<User> => {
    const response = await api.patch(`/users/${id}/toggle-status`);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  getRoles: async (): Promise<Role[]> => {
    const response = await api.get('/users/roles');
    return response.data;
  },

  updatePassword: async (id: number, currentPassword: string, newPassword: string): Promise<void> => {
    await api.put(`/users/${id}/password`, { currentPassword, newPassword });
  }
}