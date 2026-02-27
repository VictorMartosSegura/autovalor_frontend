<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <div class="wl-header">
          <h1>My Wishlist</h1>
        </div>
        <ion-buttons slot="end">
          <ion-button fill="clear" size="small"><ion-icon :icon="heartOutline" /></ion-button>
          <ion-button fill="clear" size="small"><ion-icon :icon="searchOutline" /></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="grid" v-if="wishCars.length">
        <article v-for="car in wishCars" :key="car.id" class="card" @click="goToCar(car.id)">
          <div class="card-image">
            <img :src="car.images[0]" :alt="car.brand + ' ' + car.model" />
            <button class="card-heart" @click.stop="wishlist.toggle(car.id)">
              <ion-icon :icon="heart" />
            </button>
          </div>
          <div class="card-info">
            <h3>{{ car.brand }} {{ car.model }}</h3>
            <div class="card-meta">
              <span class="rating"><ion-icon :icon="star" /> {{ car.rating }}</span>
              <span class="badge">{{ car.condition || car.type }}</span>
            </div>
            <div class="card-price">${{ formatPrice(car.price) }}</div>
          </div>
        </article>
      </div>

      <div v-else class="empty">
        <h3>Your wishlist is empty</h3>
        <p>Add cars from Home to see them here.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonButtons, IonBackButton } from '@ionic/vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { heart, heartOutline, searchOutline, star } from 'ionicons/icons';
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
<style scoped>
.wl-header {
  flex: 1;
  text-align: center;
  padding-top: 24px;
}
.wl-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1a1a1a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  padding: 20px 16px;
}

.card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.card:active {
  transform: scale(0.97);
}

.card-image {
  position: relative;
  height: 160px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 12px;
}

.card-heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.card-heart ion-icon {
  width: 18px;
  height: 18px;
  color: #e11d48;
}

.card-info {
  padding: 12px 14px;
}

.card-info h3 {
  margin: 0 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #8e8e93;
}

.rating ion-icon {
  width: 12px;
  height: 12px;
  color: #FF9500;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 8px;
  background: #e8f5e9;
  color: #2e7d32;
  border-radius: 100px;
}

.card-price {
  font-size: 15px;
  font-weight: 800;
  color: #1a1a1a;
}

.empty {
  text-align: center;
  margin-top: 60px;
  color: #8e8e93;
}

.empty h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.empty p {
  font-size: 14px;
  margin: 0;
}
</style>