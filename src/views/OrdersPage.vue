<template>
  <ion-page>
    <ion-header class="ion-no-border orders-header mobile-safe-header">
      <ion-toolbar>
        <div class="head-row">
          <div class="brand-row">
            <img :src="logo" alt="AutoValor" class="logo" />
            <h1>My Orders</h1>
          </div>
          <div class="head-actions">
            <ion-button fill="clear" size="small" @click="segment = 'active'"><ion-icon :icon="addOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="ellipsisHorizontal" /></ion-button>
          </div>
        </div>

        <div class="tabs-row">
          <button class="tab-btn" :class="{ active: segment === 'active' }" @click="segment = 'active'">Active</button>
          <button class="tab-btn" :class="{ active: segment === 'history' }" @click="segment = 'history'">Completed</button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="orders-content" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <div class="list-wrap" v-if="segment === 'active'">
        <div v-if="!activeOrders.length" class="empty-state">
          <h3>No active orders</h3>
          <p>Accepted offers will appear here after checkout.</p>
        </div>

        <button v-for="order in activeOrders" :key="order.id" class="order-card" @click="track(order.id)">
          <img :src="order.image || logo" :alt="order.title" class="car-img" />
          <div class="order-info">
            <h3>{{ order.title }}</h3>
            <p class="meta"><span class="dot"></span> {{ order.color || 'Color' }}</p>
            <div class="bottom-row">
              <strong>{{ money(order.price) }}</strong>
              <span class="pill">Track Order</span>
            </div>
          </div>
        </button>
      </div>

      <div class="list-wrap" v-else>
        <div v-if="!completedOrders.length" class="empty-state">
          <h3>No completed orders</h3>
          <p>Delivered orders will appear here.</p>
        </div>

        <button v-for="order in completedOrders" :key="order.id" class="order-card" @click="review(order.id)">
          <img :src="order.image || logo" :alt="order.title" class="car-img" />
          <div class="order-info">
            <h3>{{ order.title }}</h3>
            <p class="meta"><span class="dot completed-dot"></span> {{ order.color || 'Color' }} <span class="badge">Completed</span></p>
            <div class="bottom-row">
              <strong>{{ money(order.price) }}</strong>
              <span class="pill">Leave Review</span>
            </div>
          </div>
        </button>
      </div>

      <ion-toast :is-open="toastOpen" :message="toastMessage" :duration="1400" @didDismiss="toastOpen = false" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonToast } from '@ionic/vue';
import { addOutline, ellipsisHorizontal } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';
import { useDemoOrdersStore } from '@/stores/demoOrders';

const router = useRouter();
const route = useRoute();
const orders = useDemoOrdersStore();
const storedSegment = window.sessionStorage.getItem('orders_default_segment');
if (storedSegment) window.sessionStorage.removeItem('orders_default_segment');
const initialSegment = (storedSegment === 'active' || String(route.query.segment ?? 'history') === 'active') ? 'active' : 'history';
const segment = ref<'active' | 'history'>(initialSegment);
const toastOpen = ref(false);
const toastMessage = ref('');
const touchStartX = ref(0);

const activeOrders = computed(() => orders.orders.filter((order) => order.status === 'ACTIVE'));
const completedOrders = computed(() => orders.orders.filter((order) => order.status === 'COMPLETED'));

onMounted(() => {
  orders.init();
});

function track(id: string) {
  router.push(`/orders/${id}`);
}

function review(id: string) {
  toastMessage.value = `Review for ${id} (simulated)`;
  toastOpen.value = true;
}

function money(n: number) {
  return `${Number(n || 0).toLocaleString('es-ES')} €`;
}

function onTouchStart(event: TouchEvent) {
  touchStartX.value = event.changedTouches[0]?.clientX ?? 0;
}

function onTouchEnd(event: TouchEvent) {
  const endX = event.changedTouches[0]?.clientX ?? 0;
  const deltaX = endX - touchStartX.value;
  const threshold = 50;
  if (segment.value === 'active' && deltaX < -threshold) segment.value = 'history';
  if (segment.value === 'history' && deltaX > threshold) segment.value = 'active';
}
</script>

<style scoped>
.orders-header ion-toolbar { --background: #ffffff; padding: var(--app-safe-top) var(--app-page-gutter) 0; }
.head-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
.brand-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
.logo { width: 32px; height: 32px; object-fit: contain; }
h1 { margin: 0; color: #1f222a; font-size: clamp(24px, 7vw, 30px); line-height: 1; font-weight: 700; white-space: nowrap; }
.head-actions { display: flex; align-items: center; gap: 2px; }
.head-actions ion-button { --color: #1f222a; }
.tabs-row { margin-top: 6px; border-bottom: 1px solid #ececee; display: grid; grid-template-columns: 1fr 1fr; align-items: end; }
.tab-btn { border: 0; background: transparent; color: #aaadb5; height: 34px; font-size: 15px; font-weight: 500; position: relative; }
.tab-btn.active { color: #1f222a; font-weight: 600; }
.tab-btn.active::after { content: ''; position: absolute; left: 8%; right: 8%; bottom: -1px; height: 3px; border-radius: 3px; background: #111216; }
.orders-content { --background: #ffffff; }
.list-wrap { padding: 12px var(--app-page-gutter) 20px; }
.empty-state { min-height: 240px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; color: #8a8f97; gap: 6px; }
.empty-state h3 { margin: 0; color: #1f222a; font-size: 17px; }
.empty-state p { margin: 0; font-size: 13px; }
.order-card { width: 100%; border: 0; background: #f8f8f9; border-radius: 18px; display: flex; align-items: center; gap: 12px; padding: 12px; margin-bottom: 12px; text-align: left; }
.car-img { width: 96px; height: 64px; object-fit: contain; background: #efeff0; border-radius: 12px; padding: 4px; }
.order-info { flex: 1; min-width: 0; }
.order-info h3 { margin: 0; font-size: 16px; color: #1f222a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta { margin: 6px 0; color: #6f727a; font-size: 12px; display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; background: #cfd2d8; display: inline-block; }
.completed-dot { background: #027a48; }
.badge { background: #eceeef; color: #6b6f76; font-size: 10px; border-radius: 6px; padding: 2px 6px; margin-left: 4px; }
.bottom-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
strong { font-size: 17px; color: #1f222a; }
.pill { background: #0f1015; color: #fff; font-size: 12px; border-radius: 999px; padding: 7px 12px; }
@media (max-width: 360px) { .head-row { margin-bottom: 18px; } .car-img { width: 82px; height: 56px; } .order-info h3 { font-size: 15px; } .pill { font-size: 11px; padding: 6px 10px; } }
@media (min-width: 768px) { .orders-header ion-toolbar, .list-wrap { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>
