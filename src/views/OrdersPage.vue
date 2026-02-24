<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar><ion-title>My Orders</ion-title></ion-toolbar>

      <ion-toolbar>
        <ion-segment v-model="segment">
           <ion-segment-button value="active"><ion-label>Active</ion-label></ion-segment-button>
          <ion-segment-button value="history"><ion-label>Completed</ion-label></ion-segment-button>
        </ion-segment>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
       <div v-for="o in currentOrders" :key="o.id" class="order-card">
        <div>
          <h3>{{ o.title }}</h3>
          <p>\${{ formatPrice(o.price) }}</p>
        </div>
        <ion-button size="small" :fill="segment === 'active' ? 'solid' : 'outline'" @click="segment === 'active' ? track(o.id) : review(o.id)">
          {{ segment === 'active' ? 'Track Order' : 'Leave Review' }}
        </ion-button>
      </div>

      <ion-toast :is-open="toastOpen" :message="toastMessage" :duration="1400" @didDismiss="toastOpen = false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonButton, IonToast } from '@ionic/vue';
import { computed, ref } from 'vue';

import { useRouter } from 'vue-router';

const router = useRouter();

const segment = ref<'active' | 'history'>('active');

const activeOrders = [{ id: 'ord-001', title: 'BMW M5 Series', price: 175000 }];

const historyOrders = [
  { id: 'ord-101', title: 'Porsche Sports', price: 190000 },
  { id: 'ord-102', title: 'Toyota Sports', price: 156000 },
  { id: 'ord-103', title: 'Camaro Sports', price: 170000 },
];
const currentOrders = computed(() => (segment.value === 'active' ? activeOrders : historyOrders));

const toastOpen = ref(false);
const toastMessage = ref('');
function track(id: string) { router.push(`/orders/${id}`); }
function review(id: string) { toastMessage.value = `Review for ${id} (simulated)`; toastOpen.value = true; }
function formatPrice(n: number) { return n.toLocaleString('en-US'); }
</script>

<style scoped>
.order-card {
  border: 1px solid #efefef;
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
h3 { margin: 0 0 4px; font-size: 14px; }
p { margin: 0; font-size: 12px; color: #555; }
</style>