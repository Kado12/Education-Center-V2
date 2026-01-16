export interface Process {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProcessDto {
  name: string;
  code: string;
}

export interface UpdateProcessDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface ProcessListResponse {
  processes: Process[];
  total: number;
  page: number;
  totalPages: number;
}