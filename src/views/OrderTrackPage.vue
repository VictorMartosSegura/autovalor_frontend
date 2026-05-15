<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar class="track-toolbar">
        <ion-buttons slot="start"><ion-back-button default-href="/tabs/orders" text="" /></ion-buttons>
        <ion-title>Track Order</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" size="small"><ion-icon :icon="heartOutline" /></ion-button>
          <ion-button fill="clear" size="small"><ion-icon :icon="searchOutline" /></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="track-content">
      <div v-if="!order" class="wrap empty">
        <h3>Order not found</h3>
        <ion-button size="small" @click="router.replace('/tabs/orders')">Back to Orders</ion-button>
      </div>

      <div v-else class="wrap">
        <div class="summary-card">
          <img :src="order.image || logo" :alt="order.title" />
          <div>
            <h3>{{ order.title }}</h3>
            <p><span class="dot"></span> {{ order.color || 'Color' }}</p>
            <strong>{{ money(order.price) }}</strong>
          </div>
        </div>

        <div class="progress-card">
          <div class="icons-row">
            <ion-icon :icon="cubeOutline" />
            <ion-icon :icon="busOutline" />
            <ion-icon :icon="peopleOutline" />
            <ion-icon :icon="briefcaseOutline" />
          </div>
          <div class="line"></div>
          <p>{{ order.status === 'COMPLETED' ? 'Delivered' : 'Car Delivery (Train)' }}</p>
        </div>

        <h4>Order Status Details</h4>
        <div class="timeline">
          <div v-for="(step, i) in steps" :key="i" class="tl-item">
            <span class="tl-dot"></span>
            <div class="tl-body">
              <div class="tl-title-row">
                <strong>{{ step.title }}</strong>
                <span>{{ step.time }}</span>
              </div>
              <p>{{ step.address }}</p>
            </div>
          </div>
        </div>

        <ion-button v-if="order.status === 'ACTIVE'" expand="block" class="delivered-btn" :disabled="finishing" @click="markDelivered">
          <ion-spinner v-if="finishing" name="crescent" />
          <span v-else>Order delivered</span>
        </ion-button>

        <ion-button v-else expand="block" class="review-btn" @click="reviewOpen = true">Leave review</ion-button>
      </div>

      <ion-toast :is-open="toastOpen" :message="toastMessage" :duration="1600" @didDismiss="toastOpen = false" />
      <ion-toast :is-open="reviewOpen" message="Review saved (simulated)" :duration="1600" @didDismiss="reviewOpen = false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/vue';
import { briefcaseOutline, busOutline, cubeOutline, heartOutline, peopleOutline, searchOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';
import { useDemoOrdersStore } from '@/stores/demoOrders';
import { useAuthStore } from '@/stores/auth';
import { chatService } from '@/services/chatService';
import { createDeliveredMessage } from '@/services/demoOfferService';

const route = useRoute();
const router = useRouter();
const orders = useDemoOrdersStore();
const auth = useAuthStore();
const finishing = ref(false);
const toastOpen = ref(false);
const reviewOpen = ref(false);
const toastMessage = ref('');

const order = computed(() => orders.find(String(route.params.id)));
const steps = computed(() => {
  const completed = order.value?.status === 'COMPLETED';
  return [
    { title: completed ? 'Order delivered - Today' : 'Order .. Delivery (Train) - Today', address: 'Barcelona delivery hub', time: completed ? '18:30' : '15:20' },
    { title: 'Order ... Customs Port - Yesterday', address: 'AutoValor logistics center', time: '14:40' },
    { title: 'Orders are ... Train', address: 'Vehicle transport in progress', time: '11:30' },
    { title: 'Order is in Packing', address: 'Seller prepared the vehicle', time: '10:25' },
    { title: 'Verified Payments', address: 'Buyer payment verified', time: '10:04' },
  ];
});

onMounted(() => {
  orders.init();
});

async function markDelivered() {
  if (!order.value) return;
  finishing.value = true;
  try {
    await auth.init();
    orders.complete(order.value.id);
    if (auth.token && order.value.conversationId) {
      await chatService.sendMessage(order.value.conversationId, createDeliveredMessage(order.value.title), auth.token).catch(() => null);
    }
    toastMessage.value = 'Order marked as delivered.';
    toastOpen.value = true;
    window.sessionStorage.setItem('orders_default_segment', 'history');
  } finally {
    finishing.value = false;
  }
}

function money(n: number) {
  return `${Number(n || 0).toLocaleString('es-ES')} €`;
}
</script>

<style scoped>
.track-toolbar { --background: #fff; padding-top: var(--app-safe-top); }
.track-toolbar ion-title { font-size: 16px; font-weight: 700; color: #1f222a; }
.track-toolbar ion-button { --color: #1f222a; }
.track-content { --background: #fff; }
.wrap { padding: 18px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.empty { min-height: 300px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; color: #70737b; }
.empty h3 { margin: 0; color: #1f222a; }
.summary-card { background: #f8f8f9; border-radius: 16px; padding: 12px; display: flex; gap: 10px; }
.summary-card img { width: 82px; height: 58px; object-fit: contain; background: #efeff0; border-radius: 10px; padding: 4px; }
.summary-card h3 { margin: 0; font-size: 16px; color: #1f222a; }
.summary-card p { margin: 5px 0; color: #7b7f86; font-size: 12px; }
.summary-card strong { font-size: 17px; color: #1f222a; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: #d2d5dc; display: inline-block; margin-right: 5px; }
.progress-card { margin-top: 12px; border: 1px solid #d7e9ff; border-radius: 12px; padding: 10px; }
.icons-row { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; color: #8d9198; font-size: 22px; }
.line { margin: 10px 0 8px; border-bottom: 2px dashed #cfd2d8; }
.progress-card p { margin: 0; text-align: center; color: #1f222a; font-weight: 600; }
h4 { margin: 18px 0 10px; color: #1f222a; font-size: 15px; }
.timeline { border-left: 2px dotted #d0d3da; margin-left: 11px; }
.tl-item { position: relative; padding-left: 18px; margin-bottom: 16px; }
.tl-dot { position: absolute; left: -11px; top: 2px; width: 14px; height: 14px; border-radius: 50%; background: #fff; border: 3px solid #111216; }
.tl-title-row { display: flex; justify-content: space-between; gap: 8px; }
.tl-title-row strong { font-size: 14px; color: #1f222a; }
.tl-title-row span { font-size: 11px; color: #8b8f97; }
.tl-body p { margin: 4px 0 0; font-size: 12px; color: #8b8f97; }
.delivered-btn, .review-btn { margin-top: 18px; --border-radius: 999px; height: 52px; text-transform: none; font-weight: 700; }
.delivered-btn { --background: #111216; --color: #fff; }
.review-btn { --background: #efeff1; --color: #111216; }
@media (max-width: 360px) { .summary-card h3 { font-size: 15px; } .summary-card strong { font-size: 16px; } .tl-title-row strong { font-size: 13px; } }
@media (min-width: 768px) { .wrap { max-width: 760px; margin: 0 auto; } }
</style>
