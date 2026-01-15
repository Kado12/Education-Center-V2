export interface JwtPayload {
  sub: number; // userId
  username: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
  userId?: number;
}