import { apiClient } from './api';

export type ConversationResponse = {
  id: number;
  listingId: number;
  listingTitle: string;
  otherUserId: number;
  otherUserName: string;
  otherUserEmail: string;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
};

export type MessageResponse = {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  readAt?: string | null;
  sentByCurrentUser: boolean;
};

export const chatService = {
  startForListing(listingId: string | number, token: string) {
    return apiClient.post<ConversationResponse>(`/api/conversations/listing/${listingId}`, undefined, { token });
  },

  listConversations(token: string) {
    return apiClient.get<ConversationResponse[]>('/api/conversations', { token });
  },

  getConversation(conversationId: string | number, token: string) {
    return apiClient.get<ConversationResponse>(`/api/conversations/${conversationId}`, { token });
  },

  listMessages(conversationId: string | number, token: string) {
    return apiClient.get<MessageResponse[]>(`/api/conversations/${conversationId}/messages`, { token });
  },

  sendMessage(conversationId: string | number, content: string, token: string) {
    return apiClient.post<MessageResponse>(`/api/conversations/${conversationId}/messages`, { content }, { token });
  },
};
