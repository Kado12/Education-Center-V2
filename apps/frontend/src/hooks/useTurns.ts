import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { turnService } from "../services/turn.service"
import type { CreateTurnDto, UpdateTurnDto } from "../types/turn.types"

interface UseTurnsProps {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export const useTurns = ({ page = 1, limit = 10, search, isActive }: UseTurnsProps = {}) => {
  const queryClient = useQueryClient();

  const { data, isPending, error, isPlaceholderData } = useQuery({
    queryKey: ['turns', page, limit, search, isActive],
    queryFn: () => turnService.getTurns(page, limit, search, isActive),
    placeholderData: (previousData) => previousData,
  })

  const createTurnMutation = useMutation({
    mutationFn: (turnData: CreateTurnDto) => turnService.createTurn(turnData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] });
    },
  })

  const updateTurnMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTurnDto }) =>
      turnService.updateTurn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] });
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => turnService.toggleTurnStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] });
    },
  })

  const deleteTurnMutation = useMutation({
    mutationFn: (id: number) => turnService.deleteTurn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turns'] });
    },
  })

  return {
    turns: data?.turns || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.page || 1,

    isLoading: isPending,
    error,
    isPlaceholderData,

    createTurn: createTurnMutation.mutateAsync,
    isCreating: createTurnMutation.isPending,
    updateTurn: updateTurnMutation.mutateAsync,
    isUpdating: updateTurnMutation.isPending,
    toggleTurnStatus: toggleStatusMutation.mutateAsync,
    isToggling: toggleStatusMutation.isPending,
    deleteTurn: deleteTurnMutation.mutateAsync,
    isDeleting: deleteTurnMutation.isPending,
  }
}