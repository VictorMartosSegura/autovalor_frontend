<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header chat-header">
      <ion-toolbar>
        <div class="topbar">
          <div class="left">
            <ion-button fill="clear" size="small" class="back-btn" @click="goBack">
              <ion-icon :icon="arrowBackOutline" />
            </ion-button>
            <img class="seller-avatar" :src="logo" :alt="chatTitle" />
            <h1>
              {{ chatTitle }}
              <ion-icon class="verified" :icon="checkmarkCircle" />
            </h1>
          </div>
          <div class="actions">
            <ion-button fill="clear" size="small" @click="loadChat"><ion-icon :icon="addOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="ellipsisHorizontal" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="chat-content mobile-safe-content">
      <div class="wrap">
        <div class="day-pill">{{ conversation?.listingTitle || 'Conversation' }}</div>

        <div v-if="loading" class="state-block">
          <ion-spinner name="crescent" />
          <p>Loading messages...</p>
        </div>

        <div v-else-if="errorMessage" class="state-block">
          <p>{{ errorMessage }}</p>
          <ion-button size="small" @click="loadChat">Retry</ion-button>
        </div>

        <div v-else-if="!messages.length" class="state-block">
          <p>No messages yet.</p>
          <small>Send the first message about this vehicle.</small>
        </div>

        <template v-else>
          <div
            v-for="message in messages"
            :key="message.id"
            class="bubble"
            :class="message.sentByCurrentUser ? 'right' : 'left'"
          >
            {{ message.content }}
            <span>{{ formatMessageTime(message.createdAt) }}</span>
          </div>
        </template>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border composer">
      <div class="composer-wrap">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Message..."
          :disabled="sending"
          @keyup.enter="sendMessage"
        />
        <ion-button fill="clear" size="small" disabled><ion-icon :icon="imageOutline" /></ion-button>
        <button class="mic-btn" type="button" :disabled="sending || !newMessage.trim()" @click="sendMessage">
          <ion-spinner v-if="sending" name="crescent" />
          <ion-icon v-else :icon="sendOutline" />
        </button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonSpinner, IonToolbar } from '@ionic/vue';
import { addOutline, arrowBackOutline, checkmarkCircle, ellipsisHorizontal, imageOutline, sendOutline } from 'ionicons/icons';
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
import logo from '@/assets/logos/autovalor_logo.png';
import { chatService, type ConversationResponse, type MessageResponse } from '@/services/chatService';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const conversation = ref<ConversationResponse | null>(null);
const messages = ref<MessageResponse[]>([]);
const newMessage = ref('');
const loading = ref(false);
const sending = ref(false);
const errorMessage = ref('');

const chatTitle = computed(() => conversation.value?.otherUserName || 'Chat');

onMounted(async () => {
  await loadChat();
});

async function loadChat() {
  await auth.init();
  errorMessage.value = '';

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }

  loading.value = true;
  try {
    const id = String(route.params.id);
    const [conversationResponse, messageList] = await Promise.all([
      chatService.getConversation(id, auth.token),
      chatService.listMessages(id, auth.token),
    ]);
    conversation.value = conversationResponse;
    messages.value = messageList;
    await scrollToBottom();
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load the chat.';
  } finally {
    loading.value = false;
  }
}

async function sendMessage() {
  await auth.init();
  const content = newMessage.value.trim();

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }

  if (!content || sending.value) return;

  sending.value = true;
  errorMessage.value = '';
  try {
    const sent = await chatService.sendMessage(String(route.params.id), content, auth.token);
    messages.value.push(sent);
    newMessage.value = '';
    await scrollToBottom();
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not send the message.';
  } finally {
    sending.value = false;
  }
}

async function scrollToBottom() {
  await nextTick();
  const content = document.querySelector('ion-content.chat-content') as HTMLIonContentElement | null;
  await content?.scrollToBottom(250);
}

function goBack() {
  router.back();
}

function formatMessageTime(value?: string | null) {
  if (!value) return '';
  return dayjs(value).format('HH:mm');
}
</script>

<style scoped>
.chat-header ion-toolbar {
  --background: #fff;
  --padding-top: var(--app-safe-top);
  --min-height: 92px;
  padding: 10px var(--app-page-gutter) 6px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.seller-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: contain;
  padding: 5px;
  border: 1px solid #e7e8ec;
  background: #f6f6f7;
}

.back-btn {
  --color: #1f222a;
}

h1 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: clamp(18px, 5.5vw, 20px);
  color: #1f222a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verified {
  font-size: 15px;
  color: #2b7dff;
  flex-shrink: 0;
}

.actions ion-button {
  --color: #1f222a;
}

.chat-content {
  --background: #fff;
}

.wrap {
  min-height: 100%;
  padding: 10px var(--app-page-gutter) 20px;
}

.day-pill {
  width: fit-content;
  max-width: 90%;
  margin: 0 auto 16px;
  padding: 4px 9px;
  border-radius: 8px;
  background: #f0f1f3;
  font-size: 11px;
  color: #767b83;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.state-block {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  color: #6c7078;
}

.state-block p {
  margin: 0;
  font-size: 15px;
}

.state-block small {
  color: #9a9ea6;
}

.bubble {
  max-width: 78%;
  border-radius: 14px;
  padding: 12px 12px 10px;
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.35;
  position: relative;
  word-break: break-word;
}

.bubble span {
  display: block;
  margin-top: 5px;
  text-align: right;
  font-size: 12px;
  color: #90949d;
}

.bubble.left {
  background: #f3f4f6;
  color: #272a32;
}

.bubble.right {
  background: #111216;
  color: #fff;
  margin-left: auto;
}

.bubble.right span {
  color: #d6d7db;
}

.composer {
  background: #fff;
  padding: 10px var(--app-page-gutter) 12px;
}

.composer-wrap {
  background: #f4f4f5;
  border-radius: 999px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 6px 6px 14px;
}

.composer-wrap input {
  flex: 1;
  border: 0;
  background: transparent;
  outline: none;
  font-size: 14px;
}

.composer-wrap ion-button {
  --color: #7b8088;
}

.mic-btn {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: #111216;
  color: #fff;
  display: grid;
  place-items: center;
}

.mic-btn:disabled {
  opacity: 0.45;
}

@media (max-width: 360px) {
  .seller-avatar {
    width: 30px;
    height: 30px;
  }

  .bubble {
    max-width: 84%;
    font-size: 14px;
    padding: 10px 10px 8px;
  }

  .composer-wrap {
    padding-left: 12px;
  }

  .mic-btn {
    width: 36px;
    height: 36px;
  }
}

@media (min-width: 768px) {
  .wrap {
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>
