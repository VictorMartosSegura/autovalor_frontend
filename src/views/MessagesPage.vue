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
            <ion-button fill="clear" size="small"><ion-icon :icon="searchOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="ellipsisHorizontal" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="mobile-safe-content messages-content">
      <div class="wrap">
        <div class="tabs-title">Chats</div>

        <div class="chat-list">
          <article v-for="chat in chats" :key="chat.id" class="chat-item" @click="openChat(chat.id)">
            <ion-avatar><img :src="chat.avatar" :alt="chat.name" /></ion-avatar>
            <div class="info">
              <strong>{{ chat.name }}</strong>
              <p>{{ chat.lastMessage }}</p>
            </div>
            <div class="right">
              <span v-if="chat.unread" class="unread">{{ chat.unread }}</span>
              <span class="time">{{ chat.time }}</span>
            </div>
          </article>
        </div>
      </div>

      <button class="fab" type="button" aria-label="New chat">
        <ion-icon :icon="add" />
      </button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonAvatar, IonButton, IonIcon } from '@ionic/vue';
import { add, ellipsisHorizontal, searchOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';
import bmwStore from '@/assets/logos/bmwStore.png';
import tesla from '@/assets/logos/tesla.png';
import honda from '@/assets/logos/honda.png';
import mercedes from '@/assets/logos/mercedes.png';
import subaruStore from '@/assets/logos/subaruStore.png';
import jaguarStore from '@/assets/logos/jaguarStore.png';

const router = useRouter();

const chats = [
  { id: 'bmw-store', name: 'BMW Store', lastMessage: 'Hello, welcome to BMW ...', time: '09:41', unread: 2, avatar: bmwStore },
  { id: 'tesla-motor', name: 'Tesla Motor', lastMessage: 'I just completed it.', time: '09:22', unread: 0, avatar: tesla },
  { id: 'opel-store', name: 'Opel Store', lastMessage: 'Wow, this is really fast', time: 'Yesterday', unread: 2, avatar: mercedes },
  { id: 'nissan-official', name: 'Nissan Official', lastMessage: 'omg. this is amazing', time: '09:16', unread: 3, avatar: honda },
  { id: 'dongfeng-store', name: 'Dongfeng Store', lastMessage: 'just ideas for next time', time: 'Dec 20, 2024', unread: 0, avatar: subaruStore },
  { id: 'mercedes-benz', name: 'Mercedes-Benz', lastMessage: "I'm really like driving!", time: 'Dec 20, 2024', unread: 3, avatar: mercedes },
  { id: 'honda-motor', name: 'Honda Motor', lastMessage: 'perfect!', time: 'Dec 19, 2024', unread: 0, avatar: honda },
  { id: 'volkswagen-official', name: 'Volkswagen Official', lastMessage: 'Thanks for your message.', time: 'Dec 18, 2024', unread: 0, avatar: jaguarStore },
];

function openChat(id: string) {
  router.push(`/chat/${id}`);
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
}

ion-avatar img {
  object-fit: cover;
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

.fab {
  position: fixed;
  right: 18px;
  bottom: 88px;
  width: 52px;
  height: 52px;
  border: 0;
  border-radius: 50%;
  background: #111216;
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.2);
}

.fab ion-icon {
  font-size: 24px;
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
