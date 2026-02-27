<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/offer/${carId}`" text="" />
        </ion-buttons>
        <ion-title>Your Offer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="offer-page">
      <div class="offer-wrap">
        <div class="illustration" aria-hidden="true">
          <div class="check-circle">?</div>
        </div>

        <h2>Congrats! Your offer has been accepted!</h2>
        <p>Your offer has been accepted by the seller for {{ formatPrice(price) }}</p>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="goCheckout">Proceed to Checkout</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CARS } from '@/data/cars';

const route = useRoute();
const router = useRouter();
const carId = String(route.params.id);

const car = computed(() => CARS.find((c) => c.id === carId));
const price = computed(() => car.value?.price ?? 170000);

function formatPrice(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function goCheckout() {
  router.push({ path: '/checkout', query: { car: carId } });
}
</script>

<style scoped>
.offer-page { --background: #ffffff; }
.offer-wrap {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}
.illustration { width: 180px; height: 140px; display: grid; place-items: center; margin-bottom: 20px; }
.check-circle {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: 2px solid #252630;
  display: grid;
  place-items: center;
  font-size: 48px;
  font-weight: 700;
  color: #111216;
}
h2 { margin: 0 0 10px; font-size: 40px; line-height: 1.15; color: #202127; max-width: 560px; }
p { margin: 0; color: #6a6d75; font-size: 22px; line-height: 1.45; max-width: 520px; }
.footer { padding: 12px 20px 20px; background: #fff; }
.primary {
  --background: #07080d;
  --color: #fff;
  --border-radius: 999px;
  height: 56px;
  text-transform: none;
  font-size: 17px;
  font-weight: 600;
}
</style>
