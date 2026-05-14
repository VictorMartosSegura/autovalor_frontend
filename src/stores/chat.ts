import { defineStore } from 'pinia';
import { chatService, type ConversationResponse } from '@/services/chatService';

export const useChatStore = defineStore('chat', {
  state: () => ({
    conversations: [] as ConversationResponse[],
    unreadTotal: 0,
    loading: false,
    error: '' as string,
  }),

  actions: {
    async sync(token?: string | null) {
      if (!token) {
        this.conversations = [];
        this.unreadTotal = 0;
        return;
      }

      this.loading = true;
      this.error = '';
      try {
        this.conversations = await chatService.listConversations(token);
        this.recalculateUnread();
      } catch (error: any) {
        this.error = error?.message || 'Could not load conversations.';
      } finally {
        this.loading = false;
      }
    },

    setConversations(conversations: ConversationResponse[]) {
      this.conversations = conversations;
      this.recalculateUnread();
    },

    markConversationRead(conversationId: string | number) {
      this.conversations = this.conversations.map((conversation) => (
        String(conversation.id) === String(conversationId)
          ? { ...conversation, unreadCount: 0 }
          : conversation
      ));
      this.recalculateUnread();
    },

    recalculateUnread() {
      this.unreadTotal = this.conversations.reduce(
        (total, conversation) => total + Number(conversation.unreadCount || 0),
        0,
      );
    },
  },
});
