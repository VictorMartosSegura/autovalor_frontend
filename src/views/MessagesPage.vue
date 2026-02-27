<template>
  <ion-page>
    <ion-header  class="ion-no-border">
      <ion-toolbar>
        <ion-title>Message</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="chat-list">
        <article v-for="chat in chats" :key="chat.id" class="chat-item">
          <ion-avatar><img :src="chat.avatar" :alt="chat.name" /></ion-avatar>
          <div class="info">
            <strong>{{ chat.name }}</strong>
            <p>{{ chat.lastMessage }}</p>
          </div>
          <span class="time">{{ chat.time }}</span>
        </article>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonAvatar } from '@ionic/vue';

const chats = [
  { id: 1, name: 'BMW Store', lastMessage: 'Hola, ¿quieres cerrar la oferta?', time: '09:14', avatar: 'https://i.pravatar.cc/80?img=11' },
  { id: 2, name: 'Tesla Motor', lastMessage: 'Tenemos nuevas unidades disponibles', time: '08:20', avatar: 'https://i.pravatar.cc/80?img=12' },
  { id: 3, name: 'Nissan Official', lastMessage: 'Gracias por tu interés', time: 'Ayer', avatar: 'https://i.pravatar.cc/80?img=13' },
];
</script>
<style scoped>
.chat-list { padding: 8px 14px; }
.chat-item {
  display: flex; align-items: center; gap: 10px; padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}
ion-avatar { width: 42px; height: 42px; }
.info { flex: 1; min-width: 0; }
.info strong { font-size: 14px; }
.info p { margin: 2px 0 0; font-size: 12px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.time { font-size: 11px; color: #777; }
</style>