import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sedeService } from "../services/sede.service";
import type { CreateSedeDto, UpdateSedeDto } from "../types/sede.types";

interface UseSedesProps {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const useSedes = ({ page = 1, limit = 10, search, isActive }: UseSedesProps = {}) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, isPlaceholderData } = useQuery({
    queryKey: ['sedes', page, limit, search, isActive],
    queryFn: () => sedeService.getSedes(page, limit, search, isActive),
    placeholderData: (previousData) => previousData,
  });

  const createSedeMutation = useMutation({
    mutationFn: (sedeData: CreateSedeDto) => sedeService.createSede(sedeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
  });

  const updateSedeMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSedeDto }) =>
      sedeService.updateSede(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => sedeService.toggleSedeStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
  });

  const deleteSedeMutation = useMutation({
    mutationFn: (id: number) => sedeService.deleteSede(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sedes'] });
    },
  });

  return {
    sedes: data?.sedes || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,

    isLoading: isPending,
    error,
    isPlaceholderData,

    createSede: createSedeMutation.mutateAsync,
    isCreating: createSedeMutation.isPending,
    updateSede: updateSedeMutation.mutateAsync,
    isUpdating: updateSedeMutation.isPending,
    toggleSedeStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteSede: deleteSedeMutation.mutateAsync,
    isDeleting: deleteSedeMutation.isPending,
  }
}