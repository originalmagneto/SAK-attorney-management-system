export type UserRole = 'OWNER' | 'PARTNER' | 'ASSOCIATE' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  firmId?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  firmId?: string;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse extends AuthResponse {
  message: string;
}