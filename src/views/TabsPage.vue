<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom" class="custom-tabbar">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="orders" href="/tabs/orders">
          <ion-icon :icon="bagHandleOutline" />
          <ion-label>Orders</ion-label>
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
  homeOutline,
  bagHandleOutline,
  personOutline,
  chatbubbleEllipsesOutline,
} from 'ionicons/icons';
</script>
<style scoped>
.custom-tabbar {
  --border: 0;
  border-top: 1px solid #f1f1f1;
  padding-top: 4px;
}
ion-tab-button {
  --color-selected: #0a0a0a;
  --color: #9c9c9c;
  font-size: 10px;
}
ion-icon { font-size: 18px; }
</style>