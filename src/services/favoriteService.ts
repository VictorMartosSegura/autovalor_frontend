import { apiClient } from './api';
import type { ListingResponse } from './listingService';

export type FavoriteResponse = {
  id: number;
  listingId: number;
  listing: ListingResponse;
  createdAt: string;
};

export type FavoriteStatusResponse = {
  listingId: number;
  favorite: boolean;
  favoritesCount: number;
};

export const favoriteService = {
  list(token: string) {
    return apiClient.get<FavoriteResponse[]>('/api/favorites', { token });
  },

  add(listingId: string | number, token: string) {
    return apiClient.post<FavoriteStatusResponse>(`/api/favorites/${listingId}`, undefined, { token });
  },

  remove(listingId: string | number, token: string) {
    return apiClient.delete<FavoriteStatusResponse>(`/api/favorites/${listingId}`, { token });
  },

  status(listingId: string | number, token: string) {
    return apiClient.get<FavoriteStatusResponse>(`/api/favorites/${listingId}/status`, { token });
  },
};
