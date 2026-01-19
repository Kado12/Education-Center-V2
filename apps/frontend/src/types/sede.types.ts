export interface Sede {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSedeDto {
  name: string;
  code: string;
}

export interface UpdateSedeDto {
  name?: string;
  code?: string;
  isActive?: boolean;
}

export interface SedeListResponse {
  sedes: Sede[];
  total: number;
  page: number;
  totalPages: number;
}