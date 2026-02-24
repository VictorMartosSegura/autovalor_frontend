<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="topbar">
          <div class="brand">
            <img :src="logo" alt="AutoValor logo" class="logo" />
            <div class="title">AutoValor</div>
          </div>

          <div class="actions">
            <ion-button fill="clear" size="small">
              <ion-icon :icon="notificationsOutline" />
            </ion-button>

            <ion-button fill="clear" size="small" @click="goToWishlist">
              <ion-icon :icon="heartOutline" />
            </ion-button>
          </div>
        </div>
      </ion-toolbar>

      <ion-toolbar class="search-toolbar">
        <div class="search-pill">
          <ion-icon class="search-ic" :icon="searchOutline" />
          <ion-input v-model="query" placeholder="Search" class="search-input" clear-input />
          <button class="filter-btn" type="button">
            <ion-icon :icon="optionsOutline" />
          </button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <section class="section">
        <h3>Last View</h3>

        <div class="lastview-row">
         <article v-for="car in lastViewed" :key="car.id" class="last-card" @click="goToCar(car.id)">
            <div class="last-img">
              <img :src="car.images[0]" :alt="car.brand + ' ' + car.model" />

              <button class="last-fav" type="button" @click.stop="wishlist.toggle(car.id)">
                <ion-icon :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" />
              </button>
            </div>

            <div class="last-body">
              <div class="last-name">{{ car.brand }} {{ car.model }}</div>

              <div class="last-meta">
                <ion-icon class="star" :icon="star" />
                <span>{{ car.rating }}</span>
                <span class="dot">|</span>
                <span>{{ car.type }}</span>
              </div>

              <div class="last-price">\${{ formatPrice(car.price) }}</div>
            </div>
          </article>
        </div>
      </section>

      <section class="section">
        <h3>Serch Brand</h3>
        <div class="brand-grid">
          <button v-for="brand in brands" :key="brand.label" class="brand-pill" @click="query = brand.query" type="button">
            <div class="brand-icon">{{ brand.icon }}</div>
            <span>{{ brand.label }}</span>
          </button>
        </div>
      </section>

      <section class="section bottom-space">
        <div class="row-title">
          <h3>Top Deals</h3>
          <button class="link-btn" type="button">See All</button>
        </div>
      <article v-for="car in filteredCars" :key="car.id" class="deal-row" @click="goToCar(car.id)">
          <div class="deal-thumb"><img :src="car.images[0]" :alt="car.brand" /></div>
          <div class="deal-info">
            <div class="deal-title">{{ car.brand }} {{ car.model }}</div>
            <div class="deal-meta">
              <ion-icon :icon="star" />
              <span>{{ car.rating }}</span>
              <span class="dot">|</span>
              <span>{{ car.type }}</span>
            </div>
          </div>
          <div class="deal-price">\${{ formatPrice(car.price) }}</div>
        </article>
      </section>
    </ion-content>  
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonInput } from '@ionic/vue';

import logo from '@/assets/logos/autovalor_logo.png';

import { heart, heartOutline, notificationsOutline, optionsOutline, searchOutline, star } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { CARS, type Car } from '@/data/cars';
import { useWishlistStore } from '@/stores/wishlist';

const router = useRouter();
const wishlist = useWishlistStore();

const query = ref('');
const cars = ref<Car[]>(CARS);

onMounted(() => wishlist.init());

const lastViewed = computed(() => {
  const priorityIds = ['ferrari-race', 'camaro'];
  const preferred = priorityIds.map((id) => cars.value.find((c) => c.id === id)).filter(Boolean) as Car[];
  return preferred.length ? preferred : cars.value.slice(0, 2);
});

const brands = [
  { label: 'Mercedes', query: 'Mercedes', icon: '◉' },
  { label: 'Tesla', query: 'Tesla', icon: 'T' },
  { label: 'BMW', query: 'BMW', icon: 'B' },
  { label: 'Toyota', query: 'Toyota', icon: '◌' },
  { label: 'Volvo', query: 'Volvo', icon: 'V' },
  { label: 'Bugatti', query: 'Bugatti', icon: 'BG' },
  { label: 'Honda', query: 'Honda', icon: 'H' },
  { label: 'More', query: '', icon: '···' },
];

const filteredCars = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return cars.value.slice(0, 3);
  return cars.value.filter((c) => `${c.brand} ${c.model}`.toLowerCase().includes(q)).slice(0, 4);
});

function goToCar(id: string) {
  router.push(`/car/${id}`);
}

function goToWishlist() {
  router.push('/tabs/wishlist');
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>

<style scoped>
.topbar { display: flex; align-items: center; justify-content: space-between; padding: 4px 10px; }
.brand { display: flex; align-items: center; gap: 10px; }
.logo { width: 32px; height: 32px; object-fit: contain; }
.title { font-size: 31px; font-weight: 700; transform: scale(0.5); transform-origin: left center; margin-right: -44px; }
.actions ion-icon { font-size: 19px; color: #161616; }

.search-toolbar { padding: 4px 14px 8px; }
.search-pill {
  height: 40px;
  border-radius: 12px;
  background: #f3f3f3;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}
.search-ic { color: #b6b6b6; font-size: 16px; }
.search-input { font-size: 12px; }
.filter-btn { border: none; background: transparent; display: grid; place-items: center; color: #202020; }

.search-ic {
  font-size: 18px;
  opacity: 0.55;
  flex: 0 0 auto;
}

.search-input {
  flex: 1 1 auto;
  min-width: 0;
}

.filter-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  border-radius: 12px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
}

/* ===== Section ===== */
.section {
  padding: 8px 14px 0 14px;
}

.section-title {
  font-weight: 800;
  margin: 8px 0 12px 0;
}

/* ===== Last View cards (para que “cuadren”) ===== */
.lastview-row {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-snap-type: x mandatory;
}

.last-card {
  width: 190px;            /* fijo -> se ven iguales */
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  flex: 0 0 auto;
  scroll-snap-align: start;
}

.last-img {
  position: relative;
  height: 110px;           /* fijo -> imagen no “baila” */
  background: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
}

.last-img img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.last-fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 14px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
  display: grid;
  place-items: center;
}

.last-fav ion-icon {
  color: #e11d48;
  font-size: 16px;
}

.last-body {
  padding: 12px 14px 14px 14px;
}

.last-name {
  font-weight: 900;
  font-size: 14px;
  line-height: 1.2;
}

.last-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.75;
  margin-top: 6px;
}

.star {
  font-size: 14px;
  color: #f59e0b;
}

.dot {
  opacity: 0.6;
}

.last-price {
  margin-top: 8px;
  font-weight: 900;
  font-size: 14px;
}
</style>