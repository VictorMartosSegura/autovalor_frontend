<template>
  <ion-page>
    <ion-header class="ion-no-border home-header mobile-safe-header">
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

    <ion-content class="home-content mobile-safe-content">
      <section>
        <div class="section-header">
          <span class="section-title">Last View</span>
        </div>
        <div class="last-view-row">
          <div v-for="car in lastViewed" :key="car.id" class="product-card last-view-card" @click="goToCar(car.id)">
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
const mclarenBlack = computed(() => byId('mclaren-black'));
const lamborghini = computed(() => byId('lamborghini'));
const ferrariRace = computed(() => byId('ferrari-race'));

const lastViewed = computed(() => [
  {
    id: mclarenBlack.value?.id ?? 'mclaren-black',
    image: mclarenBlack.value?.images[0] ?? '',
    name: 'McLaren Black',
    rating: mclarenBlack.value?.rating ?? 4.9,
    tag: mclarenBlack.value?.condition ?? 'Used',
    price: mclarenBlack.value?.price ?? 280000,
  },
  {
    id: lamborghini.value?.id ?? 'lamborghini',
    image: lamborghini.value?.images[0] ?? '',
    name: 'Lamborghini',
    rating: lamborghini.value?.rating ?? 5.0,
    tag: lamborghini.value?.condition ?? 'New',
    price: lamborghini.value?.price ?? 320000,
  },
  {
    id: ferrariRace.value?.id ?? 'ferrari-race',
    image: ferrariRace.value?.images[0] ?? '',
    name: 'Ferrari Race',
    rating: ferrariRace.value?.rating ?? 4.9,
    tag: ferrariRace.value?.condition ?? 'Used',
    price: ferrariRace.value?.price ?? 185000,
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
  padding: 14px var(--app-page-gutter) 0;
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

.search-wrap { padding: 10px var(--app-page-gutter) 0; }
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

.section-header { display: flex; align-items: center; justify-content: space-between; padding: 14px var(--app-page-gutter) 10px; }
.section-title { font-size: 22px; font-weight: 700; color: #202127; }
.see-all { font-size: 14px; font-weight: 600; color: #8e8e93; cursor: pointer; }

.cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 var(--app-page-gutter); }
.last-view-row {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 0 calc(var(--app-page-gutter) + 8px) 0 calc(var(--app-page-gutter) + 20px);
  scroll-snap-type: x mandatory;
  scroll-padding-left: calc(var(--app-page-gutter) + 20px);
  -webkit-overflow-scrolling: touch;
}
.last-view-card {
  min-width: min(280px, 74vw);
  max-width: min(300px, 78vw);
  scroll-snap-align: start;
}
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

.brands-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 12px; padding: 0 var(--app-page-gutter); }
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
  .section-title {
    font-size: 20px;
  }
}

@media (max-width: 360px) {
  .navbar-brand { font-size: 18px; }
  .last-view-card {
    min-width: 78vw;
    max-width: 78vw;
  }
  .card-image { height: 108px; padding: 10px; }
  .card-info { padding: 8px 10px 12px; }
  .card-name { font-size: 14px; }
  .card-price { font-size: 15px; }
  .brand-icon { width: 46px; height: 46px; }
  .brand-icon img { width: 22px; height: 22px; }
  .brand-name { font-size: 11px; }
}

@media (min-width: 768px) {
  .cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }
  .brands-grid {
    grid-template-columns: repeat(6, minmax(0, 1fr));
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .home-navbar {
    padding-top: 6px;
  }

  .logo {
    width: 24px;
    height: 24px;
  }

  .navbar-brand {
    font-size: 16px;
  }

  .search-wrap {
    padding-top: 6px;
  }

  .search-bar {
    height: 38px;
    border-radius: 10px;
  }

  .section-header {
    padding-top: 8px;
    padding-bottom: 6px;
  }

  .section-title {
    font-size: 18px;
  }

  .last-view-card {
    min-width: 32vw;
    max-width: 32vw;
  }

  .last-view-row {
    padding-left: calc(var(--app-page-gutter) + 14px);
    scroll-padding-left: calc(var(--app-page-gutter) + 14px);
  }

  .cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .card-image {
    height: 94px;
    padding: 8px;
  }

  .card-heart {
    width: 26px;
    height: 26px;
    top: 7px;
    right: 7px;
  }

  .card-info {
    padding: 8px 10px 10px;
  }

  .card-name {
    font-size: 14px;
  }

  .card-price {
    font-size: 15px;
  }

  .brands-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 10px 8px;
  }

  .brand-icon {
    width: 42px;
    height: 42px;
  }

  .brand-icon img {
    width: 20px;
    height: 20px;
  }

  .brand-name {
    font-size: 11px;
  }
}
</style>
