<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom" class="custom-tabbar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="home" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="orders" href="/tabs/orders">
          <ion-icon :icon="receiptOutline" />
          <ion-label>Orders</ion-label>
        </ion-tab-button>

        <button type="button" class="fake-tab-button" @click="openSellMaintenance">
          <ion-icon :icon="walletOutline" />
          <ion-label>Sell</ion-label>
        </button>

        <ion-tab-button tab="messages" href="/tabs/messages">
          <ion-icon :icon="chatbubbleEllipsesOutline" />
          <ion-label>Message</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personOutline" />
          <ion-label>Profile</ion-label>
        </ion-tab-button>
      </ion-tab-bar>

      <ion-modal :is-open="maintenanceOpen" @didDismiss="maintenanceOpen = false" class="maintenance-modal">
        <div class="maintenance-wrap">
          <img :src="maintenanceImg" alt="Service under maintenance" class="maintenance-img" />
          <h2>Service Under Maintenance</h2>
          <p>This feature is temporarily unavailable.</p>
          <ion-button class="maintenance-btn" expand="block" @click="maintenanceOpen = false">Close</ion-button>
        </div>
      </ion-modal>
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
  IonModal,
  IonButton,
} from '@ionic/vue';
import { ref } from 'vue';

import {
  chatbubbleEllipsesOutline,
  home,
  personOutline,
  receiptOutline,
  walletOutline,
} from 'ionicons/icons';
import maintenanceImg from '@/assets/images/maintenance.png';

const maintenanceOpen = ref(false);

function openSellMaintenance() {
  maintenanceOpen.value = true;
}
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

.fake-tab-button {
  border: 0;
  background: transparent;
  color: #a4a7ae;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 10px;
  padding: 0;
  min-height: 44px;
  width: 100%;
  margin: 0;
}

.fake-tab-button ion-icon {
  font-size: 18px;
}

.fake-tab-button ion-label {
  line-height: 1;
}

.maintenance-modal {
  --height: auto;
  --width: min(92vw, 360px);
  --border-radius: 20px;
}

.maintenance-wrap {
  padding: 24px 18px 18px;
  text-align: center;
  background: #fff;
}

.maintenance-img {
  width: 132px;
  height: 132px;
  object-fit: contain;
  margin: 0 auto 10px;
}

.maintenance-wrap h2 {
  margin: 0 0 6px;
  font-size: 24px;
  color: #202127;
}

.maintenance-wrap p {
  margin: 0 0 14px;
  color: #6f747d;
  font-size: 14px;
}

.maintenance-btn {
  --background: #07080d;
  --color: #fff;
  --border-radius: 999px;
  height: 48px;
  text-transform: none;
}

@media (orientation: landscape) and (max-height: 500px) {
  .custom-tabbar {
    padding-top: 2px;
    padding-bottom: 1px;
  }

  ion-tab-button,
  .fake-tab-button {
    font-size: 9px;
    min-height: 38px;
  }

  ion-tab-button ion-icon,
  .fake-tab-button ion-icon {
    font-size: 16px;
  }
}
</style>
