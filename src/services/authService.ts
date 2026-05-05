import { apiClient } from './api';

export type UserRole = 'ADMIN' | 'USER';

export type AuthResponse = {
  token: string;
  tokenType: string;
  id: number;
  name: string;
  email: string;
  role: UserRole;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export const authService = {
  login(payload: LoginRequest) {
    return apiClient.post<AuthResponse>('/api/auth/login', payload);
  },

  register(payload: RegisterRequest) {
    return apiClient.post<AuthResponse>('/api/auth/register', payload);
  },

  me(token: string) {
    return apiClient.get<UserResponse>('/api/users/me', { token });
  },
};
