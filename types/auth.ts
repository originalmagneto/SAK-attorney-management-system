export type UserRole = 'OWNER' | 'PARTNER' | 'ASSOCIATE' | 'STAFF';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}