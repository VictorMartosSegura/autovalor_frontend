import { defineStore } from 'pinia';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'autovalor_wishlist_ids';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    ids: [] as string[],
    _storage: null as Storage | null,
    ready: false,
  }),

  getters: {
    isInWishlist: (state) => (id: string) => state.ids.includes(id),
  },

  actions: {
    async init() {
      if (this.ready) return;

      const storage = new Storage();
      this._storage = await storage.create();

      const saved = await this._storage.get(STORAGE_KEY);
      this.ids = Array.isArray(saved) ? saved : [];
      this.ready = true;
    },

    async toggle(id: string) {
      await this.init();

      if (this.ids.includes(id)) {
        this.ids = this.ids.filter((x) => x !== id);
      } else {
        this.ids.push(id);
      }

      await this._storage!.set(STORAGE_KEY, this.ids);
    },

    async clear() {
      await this.init();
      this.ids = [];
      await this._storage!.set(STORAGE_KEY, this.ids);
    },

    async setOrder(ids: string[]) {
      await this.init();
      this.ids = [...ids];
      await this._storage!.set(STORAGE_KEY, this.ids);
    },
  },
});
