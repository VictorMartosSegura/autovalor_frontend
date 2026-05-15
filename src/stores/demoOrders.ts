import { defineStore } from 'pinia';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';

export type DemoOrderStatus = 'ACTIVE' | 'COMPLETED';

export type DemoOrder = {
  id: string;
  listingId: number;
  title: string;
  price: number;
  image?: string;
  color?: string;
  buyerId?: number;
  sellerId?: number;
  conversationId?: number;
  status: DemoOrderStatus;
  createdAt: string;
  completedAt?: string;
};

const STORAGE_KEY = 'autovalor_demo_orders';

function readStoredOrders(): DemoOrder[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredOrders(orders: DemoOrder[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export const useDemoOrdersStore = defineStore('demoOrders', {
  state: () => ({
    orders: [] as DemoOrder[],
  }),

  actions: {
    init() {
      this.orders = readStoredOrders();
    },

    save() {
      writeStoredOrders(this.orders);
    },

    async createFromListing(listingId: number, price: number, conversationId?: number, buyerId?: number) {
      const existing = this.orders.find((order) => order.listingId === listingId && order.status === 'ACTIVE');
      if (existing) return existing;

      const listing = await listingService.getById(listingId, null).catch(() => null as ListingResponse | null);
      const images = await listingService.getImages(listingId).catch(() => []);
      const image = normalizeImageUrl(images?.[0]?.url) || normalizeImageUrl(listing?.images?.[0]?.url) || '';

      const order: DemoOrder = {
        id: `demo-${listingId}-${Date.now()}`,
        listingId,
        title: listing?.title || `${listing?.brand || ''} ${listing?.model || ''}`.trim() || 'Vehicle order',
        price,
        image,
        color: listing?.color || 'Color',
        buyerId,
        sellerId: listing?.userId,
        conversationId,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };

      this.orders = [order, ...this.orders];
      this.save();
      return order;
    },

    complete(orderId: string) {
      this.orders = this.orders.map((order) => (
        order.id === orderId
          ? { ...order, status: 'COMPLETED', completedAt: new Date().toISOString() }
          : order
      ));
      this.save();
    },

    find(orderId: string) {
      return this.orders.find((order) => order.id === orderId);
    },
  },
});
