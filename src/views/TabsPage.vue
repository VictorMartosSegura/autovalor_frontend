<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet />

      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/tabs/home">
          <ion-icon :icon="homeOutline" />
          <ion-label>Home</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="wishlist" href="/tabs/wishlist">
          <ion-icon :icon="heartOutline" />
          <ion-label>Wishlist</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="orders" href="/tabs/orders">
          <ion-icon :icon="bagHandleOutline" />
          <ion-label>Orders</ion-label>
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
  heartOutline,
  bagHandleOutline,
  personOutline,
} from 'ionicons/icons';
</script>