import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { processService } from "../services/process.service";
import type { CreateProcessDto, UpdateProcessDto } from "../types/process.types";

interface UseProcessesProps {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const useProcesses = ({ page = 1, limit = 10, search, isActive }: UseProcessesProps = {}) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, isPlaceholderData } = useQuery({
    queryKey: ['processes', page, limit, search, isActive],
    queryFn: () => processService.getProcesses(page, limit, search, isActive),
    placeholderData: (previousData) => previousData,
  });

  const createProcessMutation = useMutation({
    mutationFn: (processData: CreateProcessDto) => processService.createProcess(processData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  const updateProcessMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProcessDto }) =>
      processService.updateProcess(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => processService.toggleProcessStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  const deleteProcessMutation = useMutation({
    mutationFn: (id: number) => processService.deleteProcess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });

  return {
    processes: data?.processes || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,

    isLoading: isPending,
    error,
    isPlaceholderData,

    createProcess: createProcessMutation.mutateAsync,
    isCreating: createProcessMutation.isPending,
    updateProcess: updateProcessMutation.mutateAsync,
    isUpdating: updateProcessMutation.isPending,
    toggleProcessStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteProcess: deleteProcessMutation.mutateAsync,
    isDeleting: deleteProcessMutation.isPending,
  }
}