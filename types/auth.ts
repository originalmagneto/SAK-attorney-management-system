export type UserRole = 'OWNER' | 'PARTNER' | 'ASSOCIATE' | 'STAFF';

export interface AuthUser {
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
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: AuthUser;
}