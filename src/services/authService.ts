import { apiClient } from './api';

export type UserRole = 'ADMIN' | 'USER';

export type UserAddress = {
  country?: string | null;
  city?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

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
  addressCountry?: string | null;
  addressCity?: string | null;
  addressLine?: string | null;
  addressLatitude?: number | null;
  addressLongitude?: number | null;
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

export type UpdateProfileRequest = {
  name: string;
  email: string;
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

  updateMe(payload: UpdateProfileRequest, token: string) {
    return apiClient.put<UserResponse>('/api/users/me', payload, { token });
  },

  getAddress(token: string) {
    return apiClient.get<UserAddress>('/api/users/me/address', { token });
  },

  updateAddress(payload: UserAddress, token: string) {
    return apiClient.put<UserAddress>('/api/users/me/address', payload, { token });
  },

  deleteMe(token: string) {
    return apiClient.delete<void>('/api/users/me', { token });
  },
};
