<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/orders" />
        </ion-buttons>
        <ion-title>Track Order</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Order: {{ orderId }}</ion-card-title>
          <ion-card-subtitle>Status timeline</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-list>
            <ion-item v-for="(s, i) in steps" :key="i">
              <ion-label>
                <h3>{{ s.title }}</h3>
                <p>{{ s.date }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonList, IonItem, IonLabel
} from '@ionic/vue';

import { useRoute } from 'vue-router';

const route = useRoute();
const orderId = String(route.params.id);

const steps = [
  { title: 'Order confirmed', date: 'Today · 10:04' },
  { title: 'Preparing shipment', date: 'Today · 11:20' },
  { title: 'In delivery', date: 'Tomorrow · 09:30' },
  { title: 'Delivered', date: 'Soon' },
];
</script>