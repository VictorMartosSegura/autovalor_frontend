<template>
  <ion-page>
    <ion-content class="results-page">
      <div class="results-container">
        <div class="search-top-row">
          <ion-button fill="clear" class="back-btn" @click="goBack">
            <ion-icon :icon="arrowBackOutline" />
          </ion-button>

          <div class="search-input-wrap">
            <ion-icon :icon="searchOutline" class="search-icon" />
            <ion-input
              v-model="query"
              class="search-input"
              placeholder="Search"
              @keydown.enter="applySearch"
            />
            <ion-icon :icon="optionsOutline" class="filter-icon" />
          </div>
        </div>

        <div class="result-head">
          <p class="result-title">Results for "{{ query || 'Sports Car' }}"</p>
          <p class="result-count">9,275 founds</p>
        </div>

        <div class="results-grid">
          <div v-for="car in filteredCars" :key="car.id" class="product-card" @click="goToCar(car.id)">
            <div class="card-image">
              <img :src="car.images[0]" :alt="`${car.brand} ${car.model}`" />
              <button class="card-heart" @click.stop="toggleWish(car.id)">
                <ion-icon :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" />
              </button>
            </div>
            <div class="card-info">
              <div class="card-name">{{ formatName(car.brand, car.model) }}</div>
              <div class="card-meta">
                <span class="card-rating"><ion-icon :icon="star" /> {{ car.rating }}</span>
                <span class="card-badge">{{ car.condition ?? 'New' }}</span>
              </div>
              <div class="card-price">${{ formatPrice(car.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonInput, IonPage } from '@ionic/vue';
import { arrowBackOutline, heart, heartOutline, optionsOutline, searchOutline, star } from 'ionicons/icons';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CARS } from '@/data/cars';
import { useWishlistStore } from '@/stores/wishlist';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const query = ref(String(route.query.q ?? 'Sports Car'));

const filteredCars = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return CARS.slice(0, 6);

  const list = CARS.filter((c) => {
    const full = `${c.brand} ${c.model} ${c.type}`.toLowerCase();
    return full.includes(q);
  });

  return (list.length ? list : CARS).slice(0, 6);
});

function applySearch() {
  router.replace({ path: '/search/results', query: { q: query.value } });
}

function goBack() {
  router.back();
}

function goToCar(id: string) {
  router.push(`/car/${id}`);
}

function toggleWish(id: string) {
  wishlist.toggle(id);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}

function formatName(brand: string, model: string) {
  if (brand === 'Chevrolet' && model === 'Camaro') return 'Camaro Sports';
  if (brand === 'Ferrari') return 'Ferrari Sports';
  if (brand === 'McLaren') return 'McLaren Sports';
  if (brand === 'Toyota') return 'Toyota Sports';
  return `${brand} ${model}`;
}
</script>

<style scoped>
.results-page {
  --background: #ffffff;
}

.results-container {
  min-height: 100%;
  padding: 18px 16px 24px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.search-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  --color: #1f222a;
  --padding-start: 0;
  --padding-end: 0;
  margin: 0;
}

.search-input-wrap {
  flex: 1;
  height: 42px;
  border-radius: 10px;
  background: #f5f6f7;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.search-icon,
.filter-icon {
  font-size: 18px;
  color: #6f727a;
}

.search-input {
  flex: 1;
  --color: #1f222a;
  --placeholder-color: #a4a6ad;
  --placeholder-opacity: 1;
  font-size: 14px;
}

.result-head {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f222a;
}

.result-count {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f222a;
}

.results-grid {
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.product-card {
  background: #f6f6f7;
  border-radius: 16px;
  overflow: hidden;
}

.card-image {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-heart {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 0;
  background: #fff;
  display: grid;
  place-items: center;
}

.card-heart ion-icon {
  font-size: 14px;
  color: #1f222a;
}

.card-info {
  padding: 10px;
}

.card-name {
  font-size: 15px;
  font-weight: 700;
  color: #1f222a;
  margin-bottom: 4px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.card-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #80838a;
}

.card-rating ion-icon {
  font-size: 12px;
  color: #ff9500;
}

.card-badge {
  background: #eceeef;
  border-radius: 6px;
  padding: 2px 7px;
  font-size: 10px;
  color: #666a72;
  font-weight: 700;
}

.card-price {
  font-size: 15px;
  font-weight: 800;
  color: #1f222a;
}
</style>
