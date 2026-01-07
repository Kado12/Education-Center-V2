export interface User {
  id: number;
  name: string;
  dni: number;
  role: 'admin' | 'teacher' | 'student';
}

export interface LoginDto {
  dni: number;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface JwtPayload {
  sub: number;
  dni: number;
  role: string;
  iat?: number;
  exp?: number;
}
