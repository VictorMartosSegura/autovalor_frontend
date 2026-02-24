<template>
  <ion-page>
    <ion-header  class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button fill="clear" @click="toggleWish" v-if="car">
            <ion-icon :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" v-if="car">

      <div class="hero">
        <img :src="car.images[0]" class="car-img" />
      </div>

      <h2 class="title">{{ car.brand }} {{ car.model }}</h2>
      <div class="subtitle">
        <span class="pill">{{ car.type }}</span>
        <span>★ {{ car.rating }} (86 reviews)</span>
      </div>

      <h3>Description</h3>
      <p class="description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua.
      </p>

    <h3>Gallery Photos</h3>
      <div class="gallery">
        <div v-for="(img, i) in gallery" :key="i" class="gallery-item">
          <img :src="img" />
        </div>
      </div>

      <div class="seller">
        <div>
          <strong>BMW Store</strong>
          <p>Official Dealer</p>
        </div>
      </div>
    </ion-content>

    <ion-footer v-if="car" class="ion-no-border footer">
      <div class="price">\${{ formatPrice(car.price) }}</div>
      <ion-button class="buy-btn" @click="goToOffer">Buy the car</ion-button>
    </ion-footer>

    <ion-content v-else class="ion-padding"><p>Car not found</p></ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonFooter,
} from '@ionic/vue';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CARS } from '@/data/cars';

import { heart, heartOutline } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const car = computed(() => CARS.find((c) => c.id === String(route.params.id)));
const gallery = computed(() => (car.value ? new Array(5).fill(car.value.images[0]) : []));

function goToOffer() {
  router.push(`/offer/${route.params.id}`);
}

function toggleWish() {
  if (car.value) wishlist.toggle(car.value.id);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>

<style scoped>
.hero { background: #f7f7f7; border-radius: 18px; padding: 16px; }
.car-img { width: 100%; height: 180px; object-fit: contain; }
.title { margin: 16px 0 6px; font-size: 30px; font-weight: 900; }
.subtitle { display: flex; gap: 8px; align-items: center; color: #555; font-size: 12px; }
.pill { background: #efefef; padding: 2px 8px; border-radius: 8px; color: #111; }
h3 { font-size: 14px; margin: 16px 0 8px; }
.description { color: #555; font-size: 12px; line-height: 1.5; }
.gallery { display: flex; gap: 8px; overflow: auto; }
.gallery-item { min-width: 76px; height: 52px; background: #f4f4f4; border-radius: 10px; padding: 4px; }
.gallery-item img { width: 100%; height: 100%; object-fit: contain; }
.seller { margin: 14px 0; border-top: 1px solid #eee; padding-top: 12px; }
.seller p { margin: 2px 0 0; font-size: 12px; color: #666; }
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px 18px;
  background: #fff;
}
.price { font-size: 26px; font-weight: 900; }
.buy-btn { --background: #0d0d0d; --border-radius: 999px; font-weight: 700; }
</style>