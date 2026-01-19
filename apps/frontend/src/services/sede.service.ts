import type { CreateSedeDto, Sede, SedeListResponse, UpdateSedeDto } from "../types/sede.types";
import api from "./api";

export const sedeService = {
  getSedes: async (page = 1, limit = 10, search?: string, isActive?: boolean): Promise<SedeListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await api.get(`/sedes?${params.toString()}`);
    return response.data;
  },

  getSede: async (id: number): Promise<Sede> => {
    const response = await api.get(`/sedes/${id}`);
    return response.data;
  },

  createSede: async (sedeData: CreateSedeDto): Promise<Sede> => {
    const response = await api.post('/sedes', sedeData);
    return response.data;
  },

  updateSede: async (id: number, sedeData: UpdateSedeDto): Promise<Sede> => {
    const response = await api.put(`/sedes/${id}`, sedeData);
    return response.data;
  },

  toggleSedeStatus: async (id: number): Promise<Sede> => {
    const response = await api.patch(`/sedes/${id}/toggle-status`);
    return response.data;
  },

  deleteSede: async (id: number): Promise<void> => {
    await api.delete(`/sedes/${id}`);
  }
};