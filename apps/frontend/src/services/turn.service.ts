import type { CreateTurnDto, Turn, TurnListResponse, UpdateTurnDto } from "../types/turn.types";
import api from "./api";

export const turnService = {
  getTurns: async (page = 1, limit = 10, search?: string, isActive?: boolean): Promise<TurnListResponse> => {
    const params = new URLSearchParams()
    params.append('page', page.toString())
    params.append('limit', limit.toString())
    if (search) params.append('search', search)
    if (isActive !== undefined) params.append('isActive', isActive.toString())

    const response = await api.get<TurnListResponse>(`/turns?${params.toString()}`)
    return response.data
  },

  getTurn: async (id: number): Promise<Turn> => {
    const response = await api.get<Turn>(`/turns/${id}`)
    return response.data
  },

  createTurn: async (turnData: CreateTurnDto): Promise<Turn> => {
    const response = await api.post<Turn>('/turns', turnData)
    return response.data
  },

  updateTurn: async (id: number, turnData: UpdateTurnDto): Promise<Turn> => {
    const response = await api.put<Turn>(`/turns/${id}`, turnData)
    return response.data
  },

  toggleTurnStatus: async (id: number): Promise<Turn> => {
    const response = await api.patch<Turn>(`/turns/${id}/toggle-status`)
    return response.data
  },

  deleteTurn: async (id: number): Promise<void> => {
    await api.delete(`/turns/${id}`)
  }
}
