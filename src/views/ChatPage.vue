<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header chat-header">
      <ion-toolbar>
        <div class="topbar">
          <div class="left">
          <ion-button fill="clear" size="small" class="back-btn" @click="goBack">
              <ion-icon :icon="arrowBackOutline" />
            </ion-button>
            <img class="seller-avatar" :src="chatAvatar" :alt="chatTitle" />
            <h1>
              {{ chatTitle }}
              <ion-icon class="verified" :icon="checkmarkCircle" />
            </h1>
          </div>
          <div class="actions">
            <ion-button fill="clear" size="small"><ion-icon :icon="addOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="ellipsisHorizontal" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="chat-content mobile-safe-content">
      <div class="wrap">
        <div class="day-pill">Today</div>

        <div class="bubble left">
          Hello, welcome to BMW Official Store 🙂
          <span>09:41</span>
        </div>
        <div class="bubble left">
          Is there anything we can do to help you? 😀😀
          <span>09:41</span>
        </div>
        <div class="bubble right">
          Hi Good Morning, I want to buy a BMW M5 Series
          <span>09:41</span>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border composer">
      <div class="composer-wrap">
        <input type="text" placeholder="Message..." />
        <ion-button fill="clear" size="small"><ion-icon :icon="imageOutline" /></ion-button>
        <button class="mic-btn" type="button"><ion-icon :icon="mic" /></button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonToolbar } from '@ionic/vue';
import { addOutline, arrowBackOutline, checkmarkCircle, ellipsisHorizontal, imageOutline, mic } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import bmwStore from '@/assets/logos/bmwStore.png';
import tesla from '@/assets/logos/tesla.png';
import honda from '@/assets/logos/honda.png';
import mercedes from '@/assets/logos/mercedes.png';
import subaruStore from '@/assets/logos/subaruStore.png';
import jaguarStore from '@/assets/logos/jaguarStore.png';

const route = useRoute();
const router = useRouter();

const chatTitle = computed(() => {
  const map: Record<string, string> = {
    'bmw-store': 'BMW Store',
    'tesla-motor': 'Tesla Motor',
    'opel-store': 'Opel Store',
    'nissan-official': 'Nissan Official',
    'dongfeng-store': 'Dongfeng Store',
    'mercedes-benz': 'Mercedes-Benz',
    'honda-motor': 'Honda Motor',
    'volkswagen-official': 'Volkswagen Official',
  };
  return map[String(route.params.id)] ?? 'BMW Store';
});

const chatAvatar = computed(() => {
  const map: Record<string, string> = {
    'bmw-store': bmwStore,
    'tesla-motor': tesla,
    'opel-store': mercedes,
    'nissan-official': honda,
    'dongfeng-store': subaruStore,
    'mercedes-benz': mercedes,
    'honda-motor': honda,
    'volkswagen-official': jaguarStore,
  };
  return map[String(route.params.id)] ?? bmwStore;
});

function goBack() {
  router.back();
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
}

.seller-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e7e8ec;
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
}

.verified {
  font-size: 15px;
  color: #2b7dff;
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
  margin: 0 auto 16px;
  padding: 4px 9px;
  border-radius: 8px;
  background: #f0f1f3;
  font-size: 11px;
  color: #767b83;
}

.bubble {
  max-width: 78%;
  border-radius: 14px;
  padding: 12px 12px 10px;
  margin-bottom: 10px;
  font-size: 15px;
  line-height: 1.35;
  position: relative;
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
