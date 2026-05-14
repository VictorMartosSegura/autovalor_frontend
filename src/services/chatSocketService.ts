import { apiClient } from './api';
import type { MessageResponse } from './chatService';

function buildWebSocketUrl(conversationId: string | number, token: string) {
  const apiUrl = new URL(apiClient.baseUrl);
  apiUrl.protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';
  apiUrl.pathname = '/ws/chat';
  apiUrl.search = new URLSearchParams({
    conversationId: String(conversationId),
    token,
  }).toString();
  return apiUrl.toString();
}

export type ChatSocketHandlers = {
  onMessage: (message: MessageResponse) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: () => void;
};

export function connectChatSocket(
  conversationId: string | number,
  token: string,
  handlers: ChatSocketHandlers,
) {
  const socket = new WebSocket(buildWebSocketUrl(conversationId, token));

  socket.onopen = () => handlers.onOpen?.();
  socket.onclose = () => handlers.onClose?.();
  socket.onerror = () => handlers.onError?.();
  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data) as MessageResponse;
      handlers.onMessage(message);
    } catch {
      // Ignore invalid websocket payloads.
    }
  };

  return socket;
}
