import { apiClient } from './api';

export type VehicleAiSuggestionResponse = {
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
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
  confidence?: number;
  warnings?: string[];
};

export const vehicleAiService = {
  suggest(prompt: string, images: File[], token: string) {
    const data = new FormData();
    if (prompt?.trim()) data.append('prompt', prompt.trim());
    images.forEach((image) => data.append('images', image));
    return apiClient.post<VehicleAiSuggestionResponse>('/api/ai/vehicle-suggestions', data, { token });
  },
};
