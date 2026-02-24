<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Wishlist</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="wishlist.clear()" :disabled="wishCars.length === 0">
            Clear
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list v-if="wishCars.length > 0">
        <ion-item
          v-for="car in wishCars"
          :key="car.id"
          button
          @click="goToCar(car.id)"
        >
          <ion-thumbnail slot="start">
            <img :src="car.images[0]" :alt="car.brand + ' ' + car.model" />
          </ion-thumbnail>

          <ion-label>
            <h2>{{ car.brand }} {{ car.model }}</h2>
            <p>\${{ formatPrice(car.price) }} · ⭐ {{ car.rating }} · {{ car.type }}</p>
          </ion-label>

          <ion-button
            slot="end"
            fill="clear"
            color="danger"
            @click.stop="wishlist.toggle(car.id)"
          >
            Remove
          </ion-button>
        </ion-item>
      </ion-list>

      <p v-else>No cars in wishlist yet.</p>
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
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
} from '@ionic/vue';

import { computed } from 'vue';
import { useRouter } from 'vue-router';

import { useWishlistStore } from '@/stores/wishlist';
import { CARS } from '@/data/cars';

const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const wishCars = computed(() => CARS.filter((c) => wishlist.ids.includes(c.id)));

function goToCar(id: string) {
  router.push(`/car/${id}`);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>