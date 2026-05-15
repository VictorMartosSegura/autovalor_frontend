import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import { authService, type AuthResponse, type LoginRequest, type RegisterRequest, type UserResponse } from '@/services/authService';

const TOKEN_KEY = 'autovalor_auth_token';
const USER_KEY = 'autovalor_auth_user';

function toPlainUser(user: UserResponse | null) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    addressCountry: user.addressCountry,
    addressCity: user.addressCity,
    addressLine: user.addressLine,
    addressLatitude: user.addressLatitude,
    addressLongitude: user.addressLongitude,
  };
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    user: null as UserResponse | null,
    ready: false,
    loading: false,
    error: '' as string,
    _storage: null as Storage | null,
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },

  actions: {
    async init() {
      if (this.ready) return;

      const storage = new Storage();
      this._storage = await storage.create();
      this.token = await this._storage.get(TOKEN_KEY);

      const storedUser = await this._storage.get(USER_KEY);
      this.user = storedUser ? JSON.parse(storedUser) : null;
      this.ready = true;

      if (this.token) {
        try {
          this.user = await authService.me(this.token);
          await this.persist();
        } catch {
          await this.logout();
        }
      }
    },

    async login(payload: LoginRequest) {
      this.loading = true;
      this.error = '';
      try {
        const response = await authService.login(payload);
        await this.setSession(response);
        return response;
      } catch (error: any) {
        this.error = error?.message || 'No se pudo iniciar sesion';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(payload: RegisterRequest) {
      this.loading = true;
      this.error = '';
      try {
        const response = await authService.register(payload);
        await this.setSession(response);
        return response;
      } catch (error: any) {
        this.error = error?.message || 'No se pudo crear la cuenta';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async refreshMe() {
      await this.init();
      if (!this.token) return null;
      this.user = await authService.me(this.token);
      await this.persist();
      return this.user;
    },

    async updateProfile(payload: { name: string; email: string }) {
      await this.init();
      if (!this.token) throw new Error('No active session');
      this.user = await authService.updateMe(payload, this.token);
      await this.persist();
      return this.user;
    },

    async updateAddress(payload: { country?: string | null; city?: string | null; address?: string | null; latitude?: number | null; longitude?: number | null }) {
      await this.init();
      if (!this.token) throw new Error('No active session');
      const address = await authService.updateAddress(payload, this.token);
      this.user = {
        ...(this.user as UserResponse),
        addressCountry: address.country,
        addressCity: address.city,
        addressLine: address.address,
        addressLatitude: address.latitude,
        addressLongitude: address.longitude,
      };
      await this.persist();
      return address;
    },

    async setSession(response: AuthResponse) {
      await this.ensureStorage();
      this.token = response.token;
      this.user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      };
      await this.persist();
    },

    async persist() {
      await this.ensureStorage();
      await this._storage!.set(TOKEN_KEY, this.token);
      await this._storage!.set(USER_KEY, JSON.stringify(toPlainUser(this.user)));
    },

    async logout() {
      await this.ensureStorage();
      this.token = null;
      this.user = null;
      this.error = '';
      await this._storage!.remove(TOKEN_KEY);
      await this._storage!.remove(USER_KEY);
    },

    async ensureStorage() {
      if (this._storage) return;
      const storage = new Storage();
      this._storage = await storage.create();
    },
  },
});
