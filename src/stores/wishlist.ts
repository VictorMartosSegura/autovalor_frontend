import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';
import { favoriteService, type FavoriteResponse } from '@/services/favoriteService';

const STORAGE_KEY = 'autovalor_wishlist_ids';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    ids: [] as string[],
    favorites: [] as FavoriteResponse[],
    _storage: null as Storage | null,
    ready: false,
    loading: false,
    error: '' as string,
  }),

  getters: {
    isInWishlist: (state) => (id: string) => state.ids.includes(String(id)),
  },

  actions: {
    async init(token?: string | null) {
      if (!this._storage) {
        const storage = new Storage();
        this._storage = await storage.create();
      }

      if (!this.ready) {
        const saved = await this._storage.get(STORAGE_KEY);
        this.ids = Array.isArray(saved) ? saved.map(String) : [];
        this.ready = true;
      }

      if (token) {
        await this.sync(token);
      }
    },

    async sync(token: string) {
      this.loading = true;
      this.error = '';
      try {
        this.favorites = await favoriteService.list(token);
        this.ids = this.favorites.map((favorite) => String(favorite.listingId));
        await this.persistLocal();
      } catch (error: any) {
        this.error = error?.message || 'Could not load favorites.';
      } finally {
        this.loading = false;
      }
    },

    async toggle(id: string | number, token?: string | null) {
      await this.init();
      const normalizedId = String(id);
      const wasFavorite = this.ids.includes(normalizedId);

      if (!token) {
        this.toggleLocal(normalizedId);
        return;
      }

      this.error = '';
      try {
        if (wasFavorite) {
          await favoriteService.remove(normalizedId, token);
          this.ids = this.ids.filter((x) => x !== normalizedId);
          this.favorites = this.favorites.filter((favorite) => String(favorite.listingId) !== normalizedId);
        } else {
          await favoriteService.add(normalizedId, token);
          this.ids = [...this.ids, normalizedId];
        }
        await this.persistLocal();
      } catch (error: any) {
        this.error = error?.message || 'Could not update favorites.';
        throw error;
      }
    },

    toggleLocal(id: string) {
      if (this.ids.includes(id)) {
        this.ids = this.ids.filter((x) => x !== id);
      } else {
        this.ids.push(id);
      }
      return this.persistLocal();
    },

    async clear() {
      await this.init();
      this.ids = [];
      this.favorites = [];
      await this.persistLocal();
    },

    async setOrder(ids: string[]) {
      await this.init();
      this.ids = [...ids.map(String)];
      this.favorites = this.ids
        .map((id) => this.favorites.find((favorite) => String(favorite.listingId) === id))
        .filter((favorite): favorite is FavoriteResponse => Boolean(favorite));
      await this.persistLocal();
    },

    async persistLocal() {
      if (!this._storage) return;
      await this._storage.set(STORAGE_KEY, this.ids);
    },
  },
});
