export interface Turn {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTurnDto {
  name: string;
  startTime: string;
  endTime: string;
}

export interface UpdateTurnDto {
  name?: string;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface TurnListResponse {
  turns: Turn[];
  total: number;
  totalPages: number;
  page: number;
}
