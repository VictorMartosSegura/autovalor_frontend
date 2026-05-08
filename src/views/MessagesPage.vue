<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header messages-header">
      <ion-toolbar>
        <div class="topbar">
          <div class="left">
            <img :src="logo" alt="AutoValor" class="brand-logo" />
            <h1>Message</h1>
          </div>
          <div class="actions">
            <ion-button fill="clear" size="small" @click="loadConversations"><ion-icon :icon="searchOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="ellipsisHorizontal" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="mobile-safe-content messages-content">
      <div class="wrap">
        <div class="tabs-title">Chats</div>

        <div v-if="loading" class="state-block">
          <ion-spinner name="crescent" />
          <p>Loading conversations...</p>
        </div>

        <div v-else-if="errorMessage" class="state-block">
          <p>{{ errorMessage }}</p>
          <ion-button size="small" @click="loadConversations">Retry</ion-button>
        </div>

        <div v-else-if="!conversations.length" class="state-block">
          <p>No conversations yet.</p>
          <small>Contact a seller from a vehicle detail page.</small>
        </div>

        <div v-else class="chat-list">
          <article v-for="chat in conversations" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
            <ion-avatar><img :src="logo" :alt="chat.otherUserName" /></ion-avatar>
            <div class="info">
              <strong>{{ chat.otherUserName || 'Seller' }}</strong>
              <p>{{ chat.lastMessage || chat.listingTitle || 'Conversation started' }}</p>
            </div>
            <div class="right">
              <span v-if="chat.unreadCount" class="unread">{{ chat.unreadCount }}</span>
              <span class="time">{{ formatTime(chat.lastMessageAt || chat.updatedAt) }}</span>
            </div>
          </article>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonAvatar, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { ellipsisHorizontal, searchOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import logo from '@/assets/logos/autovalor_logo.png';
import { chatService, type ConversationResponse } from '@/services/chatService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const conversations = ref<ConversationResponse[]>([]);
const loading = ref(false);
const errorMessage = ref('');

onMounted(async () => {
  await loadConversations();
});

async function loadConversations() {
  await auth.init();
  errorMessage.value = '';

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/tabs/messages' } });
    return;
  }

  loading.value = true;
  try {
    conversations.value = await chatService.listConversations(auth.token);
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load conversations.';
  } finally {
    loading.value = false;
  }
}

function openChat(id: string | number) {
  router.push(`/chat/${id}`);
}

function formatTime(value?: string | null) {
  if (!value) return '';
  const date = dayjs(value);
  if (date.isSame(dayjs(), 'day')) return date.format('HH:mm');
  if (date.isSame(dayjs().subtract(1, 'day'), 'day')) return 'Yesterday';
  return date.format('DD MMM');
}
</script>

<style scoped>
.messages-header ion-toolbar {
  --background: #fff;
  --padding-top: var(--app-safe-top);
  --min-height: 82px;
  padding: 8px var(--app-page-gutter) 8px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.brand-logo {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px;
  min-height: 36px;
  max-width: 36px;
  max-height: 36px;
  object-fit: contain;
  display: block;
  flex: 0 0 auto;
}

h1 {
  margin: 0;
  font-size: clamp(20px, 6vw, 24px);
  line-height: 1.05;
  color: #1f222a;
  white-space: nowrap;
}

.actions {
  display: flex;
  align-items: center;
}

.actions ion-button {
  --color: #1f222a;
  margin: 0;
}

.messages-content {
  --background: #fff;
}

.wrap {
  padding: 0 var(--app-page-gutter) 28px;
}

.tabs-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #1f222a;
  padding: 8px 0 10px;
  border-bottom: 3px solid #111216;
}

.state-block {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  color: #6c7078;
}

.state-block p {
  margin: 0;
  font-size: 15px;
}

.state-block small {
  color: #9a9ea6;
}

.chat-list {
  padding-top: 8px;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

ion-avatar {
  width: 46px;
  height: 46px;
  border: 1px solid #ececef;
  background: #f6f6f7;
}

ion-avatar img {
  object-fit: contain;
  padding: 8px;
}

.info {
  flex: 1;
  min-width: 0;
}

.info strong {
  font-size: 15px;
  color: #202127;
}

.info p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #6c7078;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  min-width: 80px;
  justify-content: center;
}

.unread {
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #111216;
  color: #fff;
  font-size: 11px;
  display: grid;
  place-items: center;
  padding: 0 6px;
  line-height: 1;
}

.time {
  font-size: 12px;
  color: #7a7f87;
  text-align: right;
  width: 100%;
}

@media (max-width: 360px) {
  .brand-logo {
    width: 32px !important;
    height: 32px !important;
    min-width: 32px;
    min-height: 32px;
  }

  .tabs-title {
    font-size: 21px;
  }

  .info strong {
    font-size: 14px;
  }

  .info p,
  .time {
    font-size: 12px;
  }

  .right {
    min-width: 70px;
  }
}

@media (min-width: 768px) {
  .wrap {
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>
