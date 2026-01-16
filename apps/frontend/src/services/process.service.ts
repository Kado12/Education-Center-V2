import type { CreateProcessDto, Process, ProcessListResponse, UpdateProcessDto } from "../types/process.types";
import api from "./api";

export const processService = {
  getProcesses: async (page = 1, limit = 10, search?: string, isActive?: boolean): Promise<ProcessListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (search) params.append('search', search);
    if (isActive !== undefined) params.append('isActive', isActive.toString());

    const response = await api.get(`/processes?${params.toString()}`);
    return response.data;
  },

  getProcess: async (id: number): Promise<Process> => {
    const response = await api.get(`/processes/${id}`);
    return response.data;
  },

  createProcess: async (processData: CreateProcessDto): Promise<Process> => {
    const response = await api.post('/processes', processData);
    console.log(response)
    return response.data;
  },

  updateProcess: async (id: number, processData: UpdateProcessDto): Promise<Process> => {
    const response = await api.put(`/processes/${id}`, processData);
    return response.data;
  },

  toggleProcessStatus: async (id: number): Promise<Process> => {
    const response = await api.patch(`/processes/${id}/toggle-status`);
    return response.data;
  },

  deleteProcess: async (id: number): Promise<void> => {
    await api.delete(`/processes/${id}`);
  }
};