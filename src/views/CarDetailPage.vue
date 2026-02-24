<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <ion-title>{{ car?.brand }} {{ car?.model }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" v-if="car">

      <!-- Swiper -->
      <Swiper :modules="[Pagination]" :pagination="{ clickable: true }">
        <SwiperSlide v-for="(img, i) in car.images" :key="i">
          <img :src="img" class="car-img" />
        </SwiperSlide>
      </Swiper>

      <h2 class="title">{{ car.brand }} {{ car.model }}</h2>
      <p>Type: {{ car.type }}</p>
      <p>Rating: ⭐ {{ car.rating }}</p>
      <p><strong>Price: ${{ formatPrice(car.price) }}</strong></p>

      <ion-button expand="block" @click="goToOffer">
        Make an offer
      </ion-button>
    </ion-content>

    <ion-content v-else class="ion-padding">
      <p>Car not found</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
} from '@ionic/vue';

import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CARS } from '@/data/cars';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const route = useRoute();
const router = useRouter();

const car = computed(() => {
  const id = String(route.params.id);
  return CARS.find((c) => c.id === id);
});

function goToOffer() {
  router.push(`/offer/${route.params.id}`);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>

<style scoped>
.car-img {
  width: 100%;
  height: 260px;
  object-fit: contain;
  border-radius: 12px;
  background: #f5f5f5;
}

.title {
  margin-top: 14px;
  font-weight: 700;
}
</style>