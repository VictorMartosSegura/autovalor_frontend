<template>
  <ion-page>
    <ion-header class="ion-no-border home-header">
      <ion-toolbar class="home-navbar">
        <div class="navbar-header">
          <div class="navbar-logo">
            <img :src="logo" alt="AutoValor logo" class="logo" />
            <span class="navbar-brand">AutoValor</span>
          </div>
          <div class="navbar-actions">
            <ion-button fill="clear" size="small" class="icon-action"><ion-icon :icon="notificationsOutline" /></ion-button>
            <ion-button fill="clear" size="small" class="icon-action" @click="goToWishlist"><ion-icon :icon="heartOutline" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
      <ion-toolbar class="search-wrap">
        <div class="search-bar" role="button" tabindex="0" @click="goToSearch" @keydown.enter="goToSearch">
          <ion-icon :icon="searchOutline" />
          <span class="search-label">{{ query || 'Search' }}</span>
          <button class="filter-btn" type="button" @click.stop><ion-icon :icon="optionsOutline" /></button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content">
      <section>
        <div class="section-header">
          <span class="section-title">Last View</span>
        </div>
        <div class="cards-grid">
          <div v-for="car in lastViewed" :key="car.id" class="product-card" @click="goToCar(car.id)">
            <div class="card-image">
              <img :src="car.image" :alt="car.name" />
              <button class="card-heart" @click.stop="wishlist.toggle(car.id)"><ion-icon :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" /></button>
            </div>
            <div class="card-info">
              <div class="card-name">{{ car.name }}</div>
              <div class="card-meta">
                <span class="card-rating"><ion-icon :icon="star" /> {{ car.rating }}</span>
                <span class="card-badge">{{ car.tag }}</span>
              </div>
              <div class="card-price">${{ formatPrice(car.price) }}</div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="section-header">
          <span class="section-title">Serch Brand</span>
        </div>
        <div class="brands-grid">
          <button v-for="brand in brands" :key="brand.label" class="brand-item" @click="query = brand.query" type="button">
            <div class="brand-icon">
              <img :src="brand.iconImg" :alt="brand.label" />
            </div>
            <div class="brand-name">{{ brand.label }}</div>
          </button>
        </div>
      </section>

      <section>
        <div class="section-header">
          <span class="section-title">Top Deals</span>
          <span class="see-all">See All</span>
        </div>
        <div class="cards-grid">
          <div v-for="car in topDeals" :key="car.id" class="product-card" @click="goToCar(car.id)">
            <div class="card-image">
              <img :src="car.images[0]" :alt="car.brand" />
              <button class="card-heart" @click.stop="wishlist.toggle(car.id)"><ion-icon :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" /></button>
            </div>
            <div class="card-info">
              <div class="card-name">{{ car.brand }} {{ car.model }}</div>
              <div class="card-meta">
                <span class="card-rating"><ion-icon :icon="star" /> {{ car.rating }}</span>
                <span class="card-badge">{{ car.type }}</span>
              </div>
              <div class="card-price">${{ formatPrice(car.price) }}</div>
            </div>
          </div>
        </div>
      </section>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon } from '@ionic/vue';
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

const byId = (id: string) => cars.value.find((c) => c.id === id);
const ferrari = computed(() => byId('ferrari-race'));
const camaro = computed(() => byId('camaro'));

const lastViewed = computed(() => [
  {
    id: ferrari.value?.id ?? 'ferrari-race',
    image: ferrari.value?.images[0] ?? '',
    name: 'Porsche Sports',
    rating: 4.9,
    tag: 'New',
    price: 190000,
  },
  {
    id: camaro.value?.id ?? 'camaro',
    image: camaro.value?.images[0] ?? '',
    name: 'Camaro Sports',
    rating: 4.7,
    tag: 'New',
    price: 170000,
  },
]);

const topDeals = computed(() => {
  const ids = ['bmw-m5', 'ferrari-race', 'camaro', 'jaguar', 'mclaren-720', 'subaru-wrx'];
  return ids.map((id) => byId(id)).filter(Boolean) as Car[];
});

const brandLogo = (name: string) => new URL(`../assets/logos/${name}`, import.meta.url).href;

const brands = [
  { label: 'Mercedes', query: 'Mercedes', iconImg: brandLogo('mercedes.png') },
  { label: 'Tesla', query: 'Tesla', iconImg: brandLogo('tesla.png') },
  { label: 'BMW', query: 'BMW', iconImg: brandLogo('bmw.png') },
  { label: 'Toyota', query: 'Toyota', iconImg: brandLogo('toyota.png') },
  { label: 'Volvo', query: 'Volvo', iconImg: brandLogo('volvo.png') },
  { label: 'Bugatti', query: 'Bugatti', iconImg: brandLogo('bugatti.png') },
  { label: 'Honda', query: 'Honda', iconImg: brandLogo('honda.png') },
  { label: 'More', query: '', iconImg: brandLogo('more.png') },
];

function goToCar(id: string) {
  router.push(`/car/${id}`);
}
function goToWishlist() {
  router.push('/tabs/wishlist');
}
function goToSearch() {
  router.push({ path: '/search', query: { q: query.value } });
}
function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>

<style scoped>
.home-header,
.home-navbar,
.search-wrap {
  --background: #ffffff;
}

.home-navbar {
  padding: 14px 18px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.navbar-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}
.navbar-brand {
  font-size: 20px;
  font-weight: 700;
  color: #202127;
}
.navbar-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}
.icon-action {
  --color: #202127;
}

.search-wrap { padding: 10px 18px 0; }
.search-bar {
  display: flex;
  align-items: center;
  background: #f6f6f7;
  border-radius: 12px;
  padding: 0 14px;
  height: 44px;
  gap: 10px;
  cursor: pointer;
}
.search-label {
  flex: 1;
  color: #adadb1;
  font-size: 15px;
  line-height: 1;
}
.search-bar ion-icon { width: 18px; height: 18px; color: #9ea0a6; flex-shrink: 0; }
.filter-btn { border: none; background: none; display: grid; place-items: center; color: #70737b; }

.home-content { --background: #ffffff; }

.section-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px 10px; }
.section-title { font-size: 22px; font-weight: 700; color: #202127; }
.see-all { font-size: 14px; font-weight: 600; color: #8e8e93; cursor: pointer; }

.cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 18px; }
.product-card {
  background: #f6f6f7;
  border-radius: 20px;
  overflow: hidden; cursor: pointer;
  box-shadow: none;
}
.card-image {
  position: relative; height: 122px;
  display: flex; align-items: center; justify-content: center;
  padding: 12px;
}
.card-image img { width: 100%; height: 100%; object-fit: contain; }
.card-heart {
  position: absolute; top: 9px; right: 9px;
  width: 30px; height: 30px;
  background: #fff; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-heart ion-icon { width: 16px; height: 16px; color: #e11d48; }
.card-info { padding: 10px 12px 14px; }
.card-name { font-size: 15px; font-weight: 700; color: #1f222a; margin-bottom: 4px; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.card-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 600; color: #8e8e93; }
.card-rating ion-icon { width: 12px; height: 12px; color: #FF9500; }
.card-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; background: #eceeef; color: #5a5d66; border-radius: 6px; }
.card-price { font-size: 17px; font-weight: 800; color: #1f222a; }

.brands-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 12px; padding: 0 18px; }
.brand-item { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; background: none; border: none; }
.brand-icon {
  width: 52px; height: 52px;
  background: #f0f0f1; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 2px;
}
.brand-icon img { width: 26px; height: 26px; object-fit: contain; }
.brand-name { font-size: 12px; font-weight: 600; color: #2b2d33; }

/* Responsive for mobile */
@media (max-width: 600px) {
  .home-navbar,
  .section-header {
    padding-left: 14px;
    padding-right: 14px;
  }
  .search-wrap {
    padding-left: 14px;
    padding-right: 14px;
  }
  .cards-grid,
  .brands-grid {
    padding-left: 14px;
    padding-right: 14px;
  }
  .section-title {
    font-size: 20px;
  }
}
</style>
