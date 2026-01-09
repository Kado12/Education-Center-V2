import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { userService } from '../services/user.service';

interface UseUsersProps {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const useUsers = ({ page = 1, limit = 10, search, isActive }: UseUsersProps = {}) => {
  const queryClient = useQueryClient();

  // Query para listar usuarios ✅ ACTUALIZADO
  const { data, isPending, error, isPlaceholderData } = useQuery({
    queryKey: ['users', page, limit, search, isActive],
    queryFn: () => userService.getUsers(page, limit, search, isActive),
    placeholderData: (previousData) => previousData,
  });

  // Query para obtener roles
  const { data: rolesData = [], isPending: rolesPending } = useQuery({
    queryKey: ['roles'],
    queryFn: userService.getRoles,
  });

  // Mutación para crear usuario ✅ ACTUALIZADO
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserDto) => userService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutación para actualizar usuario ✅ ACTUALIZADO
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserDto }) =>
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutación para alternar estado ✅ ACTUALIZADO
  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => userService.toggleUserStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Mutación para eliminar usuario ✅ ACTUALIZADO
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    // Datos
    users: data?.users || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,
    roles: rolesData,

    // Estados ✅ ACTUALIZADO
    isLoading: isPending,
    rolesLoading: rolesPending,
    error,
    isPlaceholderData,

    // Funciones de mutación ✅ ACTUALIZADO
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending,

    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,

    toggleUserStatus: toggleStatusMutation.mutate,
    isToggling: toggleStatusMutation.isPending,

    deleteUser: deleteUserMutation.mutate,
    isDeleting: deleteUserMutation.isPending,
  };
};