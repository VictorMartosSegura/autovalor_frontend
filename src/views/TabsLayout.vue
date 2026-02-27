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

        <ion-tab-button tab="sell" href="/tabs/sell">
          <ion-icon :icon="walletOutline" />
          <ion-label>Sell</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="messages" href="/tabs/messages">
          <ion-icon :icon="chatbubbleEllipsesOutline" />
          <ion-label>Message</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="profile" href="/tabs/profile">
          <ion-icon :icon="personOutline" />
          <ion-label>Profile</ion-label>
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

import {
  chatbubbleEllipsesOutline,
  home,
  personOutline,
  receiptOutline,
  walletOutline,
} from 'ionicons/icons';
</script>
<style scoped>
.custom-tabbar {
  --background: #ffffff;
  --border: 0;
  border-top: 1px solid #f0f1f3;
  padding-top: 4px;
  padding-bottom: 2px;
}

ion-tab-button {
  --color-selected: #111216;
  --color: #a4a7ae;
  font-size: 10px;
}

ion-tab-button ion-icon {
  font-size: 18px;
}
</style>
