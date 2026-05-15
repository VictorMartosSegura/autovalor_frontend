import type { MessageResponse } from './chatService';

export type DemoOfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export type DemoOfferPayload = {
  type: 'offer';
  offerId: string;
  listingId: number;
  listingTitle: string;
  amount: number;
  buyerId?: number;
  buyerName?: string;
  createdAt: string;
};

export type DemoOfferStatusPayload = {
  type: 'offer-status';
  offerId: string;
  listingId: number;
  listingTitle: string;
  amount: number;
  status: DemoOfferStatus;
  sellerName?: string;
  createdAt: string;
};

export const OFFER_PREFIX = '[AUTOVALOR_OFFER]';
export const OFFER_STATUS_PREFIX = '[AUTOVALOR_OFFER_STATUS]';
export const ORDER_DELIVERED_PREFIX = '[AUTOVALOR_ORDER_DELIVERED]';

export function createOfferMessage(payload: Omit<DemoOfferPayload, 'type' | 'createdAt'>) {
  return `${OFFER_PREFIX}${JSON.stringify({ ...payload, type: 'offer', createdAt: new Date().toISOString() })}`;
}

export function createOfferStatusMessage(payload: Omit<DemoOfferStatusPayload, 'type' | 'createdAt'>) {
  return `${OFFER_STATUS_PREFIX}${JSON.stringify({ ...payload, type: 'offer-status', createdAt: new Date().toISOString() })}`;
}

export function createDeliveredMessage(listingTitle: string) {
  return `${ORDER_DELIVERED_PREFIX}${JSON.stringify({ listingTitle, createdAt: new Date().toISOString() })}`;
}

export function parseOfferMessage(content: string): DemoOfferPayload | null {
  if (!content?.startsWith(OFFER_PREFIX)) return null;
  try {
    const parsed = JSON.parse(content.slice(OFFER_PREFIX.length));
    return parsed?.type === 'offer' ? parsed : null;
  } catch {
    return null;
  }
}

export function parseOfferStatusMessage(content: string): DemoOfferStatusPayload | null {
  if (!content?.startsWith(OFFER_STATUS_PREFIX)) return null;
  try {
    const parsed = JSON.parse(content.slice(OFFER_STATUS_PREFIX.length));
    return parsed?.type === 'offer-status' ? parsed : null;
  } catch {
    return null;
  }
}

export function parseDeliveredMessage(content: string): { listingTitle: string; createdAt: string } | null {
  if (!content?.startsWith(ORDER_DELIVERED_PREFIX)) return null;
  try {
    return JSON.parse(content.slice(ORDER_DELIVERED_PREFIX.length));
  } catch {
    return null;
  }
}

export function isSystemOfferMessage(content: string) {
  return content.startsWith(OFFER_PREFIX) || content.startsWith(OFFER_STATUS_PREFIX) || content.startsWith(ORDER_DELIVERED_PREFIX);
}

export function getOfferStatus(offerId: string, messages: MessageResponse[]): DemoOfferStatus {
  const statusMessage = [...messages]
    .reverse()
    .map((message) => parseOfferStatusMessage(message.content))
    .find((status) => status?.offerId === offerId);

  return statusMessage?.status || 'PENDING';
}

export function formatEuro(value: number) {
  return `${Number(value || 0).toLocaleString('es-ES')} €`;
}
