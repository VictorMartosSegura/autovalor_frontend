<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/checkout" text="" /></ion-buttons>
        <ion-title>Choose Shipping</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="wrap">
        <button v-for="item in methods" :key="item.id" class="row" @click="selected = item.id">
          <div>
            <strong>{{ item.name }}</strong>
            <p>{{ item.eta }}</p>
          </div>
          <div class="right">
            <strong class="price">${{ item.price }}</strong>
            <ion-icon :icon="selected === item.id ? radioButtonOnOutline : radioButtonOffOutline" />
          </div>
        </button>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="apply">Apply</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { radioButtonOffOutline, radioButtonOnOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const selected = ref(String(route.query.shipping ?? 'train'));

const methods = [
  { id: 'truck', name: 'Truck', eta: 'Est. Arrival, Dec 20-23', price: 200 },
  { id: 'train', name: 'Train', eta: 'Est. Arrival, Dec 20-22', price: 250 },
  { id: 'ship', name: 'Container Ship', eta: 'Est. Arrival, Dec 19-20', price: 300 },
  { id: 'plane', name: 'Plane', eta: 'Est. Arrival, Dec 18-19', price: 400 },
];

function apply() {
  router.replace({ path: '/checkout', query: { car: String(route.query.car ?? 'bmw-m5'), shipping: selected.value, address: String(route.query.address ?? 'home') } });
}
</script>

<style scoped>
.page { --background: #fff; }
.wrap { padding: 12px 16px 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.row { width: 100%; background: #f8f8f9; border: 0; border-radius: 16px; padding: 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
strong { font-size: 15px; color: #202127; }
p { margin: 4px 0 0; font-size: 12px; color: #7d8088; }
.right { display: flex; align-items: center; gap: 10px; }
.price { font-size: 28px; }
.footer { padding: 12px 16px 20px; }
.primary { --background: #07080d; --border-radius: 999px; height: 52px; text-transform: none; font-weight: 600; }
</style>
