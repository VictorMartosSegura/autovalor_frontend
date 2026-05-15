<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom" class="custom-tabbar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>{{ prefs.t('home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="orders" href="/tabs/orders">
          <ion-icon :icon="receiptOutline" />
          <ion-label>{{ prefs.t('orders') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sell" href="/tabs/sell">
          <ion-icon :icon="walletOutline" />
          <ion-label>{{ prefs.t('sell') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="messages" href="/tabs/messages" class="messages-tab">
          <div class="tab-icon-wrap">
            <ion-icon :icon="chatbubbleEllipsesOutline" />
            <span v-if="chat.unreadTotal > 0" class="tab-badge">{{ badgeText }}</span>
          </div>
          <ion-label>{{ prefs.t('message') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personOutline" />
          <ion-label>{{ prefs.t('profile') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/vue';
import { computed, onMounted, onBeforeUnmount } from 'vue';

import {
  chatbubbleEllipsesOutline,
  home,
  personOutline,
  receiptOutline,
  walletOutline,
} from 'ionicons/icons';
import { useAuthStore } from '@/stores/auth';
import { useChatStore } from '@/stores/chat';
import { usePreferencesStore } from '@/stores/preferences';

const auth = useAuthStore();
const chat = useChatStore();
const prefs = usePreferencesStore();
let unreadInterval: ReturnType<typeof window.setInterval> | null = null;

const badgeText = computed(() => chat.unreadTotal > 9 ? '9+' : String(chat.unreadTotal));

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  await chat.sync(auth.token);

  unreadInterval = window.setInterval(async () => {
    await auth.init();
    await chat.sync(auth.token);
  }, 10000);
});

onBeforeUnmount(() => {
  if (unreadInterval) {
    window.clearInterval(unreadInterval);
    unreadInterval = null;
  }
});
</script>
<style scoped>
.custom-tabbar {
  --background: #ffffff;
  --border: 0;
  border-top: 1px solid #f0f1f3;
  padding-top: 4px;
  padding-bottom: 2px;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  align-items: stretch;
}

ion-tab-button {
  --color-selected: #111216;
  --color: #a4a7ae;
  font-size: 10px;
  width: 100%;
  max-width: 100%;
  margin: 0;
}

ion-tab-button ion-icon {
  font-size: 18px;
}

.tab-icon-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 20px;
}

.tab-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  min-width: 17px;
  height: 17px;
  padding: 0 5px;
  border-radius: 999px;
  background: #111216;
  color: #fff;
  font-size: 10px;
  line-height: 17px;
  font-weight: 800;
  text-align: center;
  box-shadow: 0 2px 5px rgba(17, 18, 22, 0.22);
}

@media (orientation: landscape) and (max-height: 500px) {
  .custom-tabbar {
    padding-top: 2px;
    padding-bottom: 1px;
  }

  ion-tab-button {
    font-size: 9px;
    min-height: 38px;
  }

  ion-tab-button ion-icon {
    font-size: 16px;
  }

  .tab-badge {
    top: -4px;
    right: -4px;
    min-width: 15px;
    height: 15px;
    font-size: 9px;
    line-height: 15px;
  }
}
</style>
