<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/offer/${carId}`" text="" />
        </ion-buttons>
        <ion-title>Your Offer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="offer-page mobile-safe-content">
      <div class="offer-wrap">
        <img class="illustration" :src="acceptedOfferImg" alt="Offer accepted" />

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
import acceptedOfferImg from '@/assets/images/acepted_offer.png';

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
  padding: 24px var(--app-page-gutter);
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}
.illustration { width: 170px; height: 170px; object-fit: contain; margin-bottom: 20px; }
h2 { margin: 0 0 10px; font-size: 40px; line-height: 1.15; color: #202127; max-width: 560px; }
p { margin: 0; color: #6a6d75; font-size: 22px; line-height: 1.45; max-width: 520px; }
.footer { padding: 12px var(--app-page-gutter) 20px; background: #fff; }
.primary {
  --background: #07080d;
  --color: #fff;
  --border-radius: 999px;
  height: 56px;
  text-transform: none;
  font-size: 17px;
  font-weight: 600;
}

h2 { font-size: clamp(28px, 9vw, 40px); }
p { font-size: clamp(16px, 5.5vw, 22px); }

@media (max-width: 360px) {
  .illustration {
    width: 150px;
    height: 150px;
  }
}

@media (min-width: 768px) {
  .offer-wrap,
  .footer {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
