import { apiClient } from './api';

export type ListingStatus = 'AVAILABLE' | 'RESERVED' | 'SOLD' | 'HIDDEN';

export type ListingResponse = {
  id: number;
  title?: string;
  description?: string;
  price: number;
  brand: string;
  model: string;
  year?: number;
  km?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  province?: string;
  sellerType?: string;
  bodyType?: string;
  doors?: number;
  powerCv?: number;
  engineSize?: string;
  environmentalLabel?: string;
  warranty?: boolean;
  color?: string;
  registrationMonth?: number;
  registrationYear?: number;
  previousOwners?: number;
  financeable?: boolean;
  maintenanceBook?: boolean;
  status?: ListingStatus;
  userId?: number;
  userName?: string;
  createdAt?: string;
  images?: ListingImageResponse[];
};

export type ListingImageResponse = {
  id: number;
  listingId: number;
  fileName?: string;
  url?: string;
  contentType?: string;
  sizeBytes?: number;
  createdAt?: string;
};

export type CreateListingRequest = {
  title: string;
  description?: string;
  price: number;
  brand: string;
  model: string;
  year: number;
  km: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  province?: string;
  sellerType?: string;
  bodyType?: string;
  doors?: number | null;
  powerCv?: number | null;
  engineSize?: string;
  environmentalLabel?: string;
  warranty?: boolean | null;
  color?: string;
  registrationMonth?: number | null;
  registrationYear?: number | null;
  previousOwners?: number | null;
  financeable?: boolean | null;
  maintenanceBook?: boolean | null;
};

export type ListingPageResponse = {
  content: ListingResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type ListingSearchParams = {
  q?: string;
  brand?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  fuelType?: string;
  transmission?: string;
  province?: string;
  bodyType?: string;
  page?: number;
  size?: number;
  sort?: string;
};

function buildQuery(params: ListingSearchParams = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '') {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function normalizeImageUrl(url?: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiClient.baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
}

export const listingService = {
  list(params: ListingSearchParams = {}) {
    return apiClient.get<ListingPageResponse | ListingResponse[]>(`/api/cars${buildQuery(params)}`);
  },

  listAllPublic() {
    return apiClient.get<ListingResponse[]>('/api/cars/all');
  },

  getById(id: string | number) {
    return apiClient.get<ListingResponse>(`/api/cars/${id}`);
  },

  create(payload: CreateListingRequest, token: string) {
    return apiClient.post<ListingResponse>('/api/cars', payload, { token });
  },

  uploadImage(listingId: string | number, file: File, token: string) {
    const data = new FormData();
    data.append('image', file);
    return apiClient.post<ListingImageResponse>(`/api/cars/${listingId}/images`, data, { token });
  },

  getImages(id: string | number) {
    return apiClient.get<ListingImageResponse[]>(`/api/cars/${id}/images`);
  },
};
