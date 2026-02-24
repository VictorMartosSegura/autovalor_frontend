<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>My Orders</ion-title>
      </ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="segment">
          <ion-segment-button value="active">
            <ion-label>Active</ion-label>
          </ion-segment-button>
          <ion-segment-button value="history">
            <ion-label>History</ion-label>
          </ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list v-if="segment === 'active'">
        <ion-item v-for="o in activeOrders" :key="o.id">
          <ion-label>
            <h2>{{ o.title }}</h2>
            <p>\${{ formatPrice(o.price) }}</p>
          </ion-label>

          <ion-button slot="end" @click="track(o.id)">Track Order</ion-button>
        </ion-item>
      </ion-list>

      <ion-list v-else>
        <ion-item v-for="o in historyOrders" :key="o.id">
          <ion-label>
            <h2>{{ o.title }}</h2>
            <p>\${{ formatPrice(o.price) }} · Completed</p>
          </ion-label>

          <ion-button slot="end" fill="outline" @click="review(o.id)">
            Leave Review
          </ion-button>
        </ion-item>
      </ion-list>

      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
        :duration="1400"
        @didDismiss="toastOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem, IonButton, IonToast
} from '@ionic/vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const segment = ref<'active' | 'history'>('active');

const activeOrders = [
  { id: 'ord-001', title: 'BMW M5 Series', price: 175000 },
];

const historyOrders = [
  { id: 'ord-101', title: 'Porsche Sports', price: 190000 },
  { id: 'ord-102', title: 'Toyota Sports', price: 156000 },
];

const toastOpen = ref(false);
const toastMessage = ref('');

function track(id: string) {
  router.push(`/orders/${id}`);
}

function review(id: string) {
  toastMessage.value = `Review for ${id} (simulated)`;
  toastOpen.value = true;
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>