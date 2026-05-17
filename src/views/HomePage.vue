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
          <span class="search-label">{{ query || prefs.t('searchCar') }}</span>
          <button class="filter-btn" type="button" @click.stop><ion-icon :icon="optionsOutline" /></button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="home-content mobile-safe-content">
      <ion-refresher slot="fixed" @ionRefresh="refreshListings">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="loading" class="state-block">
        <ion-spinner name="crescent" />
        <p>{{ prefs.t('loadingListings') }}</p>
      </div>

      <div v-else-if="errorMessage" class="state-block">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" @click="loadListings">{{ prefs.t('retry') }}</ion-button>
      </div>

      <div v-else>
        <section v-if="lastViewed.length">
          <div class="section-header">
            <span class="section-title">{{ prefs.t('latestListings') }}</span>
          </div>
          <div class="last-view-row">
            <div v-for="car in lastViewed" :key="car.id" class="product-card last-view-card" @click="goToCar(car.id)">
              <div class="card-image">
                <img :src="car.image" :alt="car.name" />
                <span v-if="car.statusBadge" class="status-overlay" :class="car.statusClass">{{ car.statusBadge }}</span>
                <button class="card-heart" @click.stop="toggleFavorite(car.id)"><ion-icon :icon="wishlist.isInWishlist(String(car.id)) ? heart : heartOutline" /></button>
              </div>
              <div class="card-info">
                <div class="card-name">{{ car.name }}</div>
                <div class="card-meta">
                  <span class="card-rating"><ion-icon :icon="star" /> {{ car.year || 'S/A' }}</span>
                  <span class="card-badge" :class="car.statusClass">{{ car.tag }}</span>
                </div>
                <div class="card-price">{{ formatPrice(car.price) }} €</div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div class="section-header">
            <span class="section-title">{{ prefs.t('searchBrand') }}</span>
          </div>
          <div class="brands-grid">
            <button v-for="brand in brands" :key="brand.label" class="brand-item" @click="filterByBrand(brand.query)" type="button">
              <div class="brand-icon">
                <img :src="brand.iconImg" :alt="brand.label" />
              </div>
              <div class="brand-name">{{ brand.label }}</div>
            </button>
          </div>
        </section>

        <section>
          <div class="section-header">
            <span class="section-title">{{ prefs.t('featuredListings') }}</span>
            <span class="see-all" @click="goToSearch">{{ prefs.t('seeAll') }}</span>
          </div>

          <div v-if="topDeals.length" class="cards-grid">
            <div v-for="car in topDeals" :key="car.id" class="product-card" @click="goToCar(car.id)">
              <div class="card-image">
                <img :src="car.image" :alt="car.name" />
                <span v-if="car.statusBadge" class="status-overlay" :class="car.statusClass">{{ car.statusBadge }}</span>
                <button class="card-heart" @click.stop="toggleFavorite(car.id)"><ion-icon :icon="wishlist.isInWishlist(String(car.id)) ? heart : heartOutline" /></button>
              </div>
              <div class="card-info">
                <div class="card-name">{{ car.name }}</div>
                <div class="card-meta">
                  <span class="card-rating"><ion-icon :icon="star" /> {{ car.year || 'S/A' }}</span>
                  <span class="card-badge" :class="car.statusClass">{{ car.tag }}</span>
                </div>
                <div class="card-price">{{ formatPrice(car.price) }} €</div>
              </div>
            </div>
          </div>

          <div v-else class="empty-block">
            <h3>{{ prefs.t('noListingsYet') }}</h3>
            <p>{{ prefs.t('createFirstListing') }}</p>
            <ion-button size="small" @click="router.push('/tabs/sell')">{{ prefs.t('createListing') }}</ion-button>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/vue';
import logo from '@/assets/logos/autovalor_logo.png';
import { heart, heartOutline, notificationsOutline, optionsOutline, searchOutline, star } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const router = useRouter();
const wishlist = useWishlistStore();
const auth = useAuthStore();
const prefs = usePreferencesStore();
const query = ref('');
const listings = ref<ListingResponse[]>([]);
const loading = ref(false);
const errorMessage = ref('');

const fallbackImage = new URL('../assets/logos/autovalor_logo.png', import.meta.url).href;

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  await wishlist.init(auth.token);
  await loadListings();
});

const cards = computed(() => listings.value.map(toCard));
const lastViewed = computed(() => cards.value.slice(0, 5));
const topDeals = computed(() => cards.value.slice(0, 8));

const brandLogo = (name: string) => new URL(`../assets/logos/${name}`, import.meta.url).href;

const brands = computed(() => [
  { label: 'Mercedes', query: 'Mercedes', iconImg: brandLogo('mercedes.png') },
  { label: 'Tesla', query: 'Tesla', iconImg: brandLogo('tesla.png') },
  { label: 'BMW', query: 'BMW', iconImg: brandLogo('bmw.png') },
  { label: 'Toyota', query: 'Toyota', iconImg: brandLogo('toyota.png') },
  { label: 'Volvo', query: 'Volvo', iconImg: brandLogo('volvo.png') },
  { label: 'Bugatti', query: 'Bugatti', iconImg: brandLogo('bugatti.png') },
  { label: 'Honda', query: 'Honda', iconImg: brandLogo('honda.png') },
  { label: prefs.t('more'), query: '', iconImg: brandLogo('more.png') },
]);

async function loadListings() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const publicListings = await listingService.listAllPublic();
    listings.value = await Promise.all(publicListings.map(async (listing) => {
      const images = await listingService.getImages(listing.id).catch(() => listing.images || []);
      return { ...listing, images };
    }));
  } catch (error: any) {
    errorMessage.value = error?.message || prefs.t('couldNotLoadListings');
  } finally {
    loading.value = false;
  }
}

async function refreshListings(event: CustomEvent) {
  await auth.init();
  prefs.init(auth.user?.id);
  await wishlist.init(auth.token);
  await loadListings();
  (event.target as HTMLIonRefresherElement).complete();
}

async function toggleFavorite(id: string | number) {
  await auth.init();
  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/tabs/home' } });
    return;
  }
  await wishlist.toggle(String(id), auth.token);
}

function toCard(listing: ListingResponse) {
  const image = normalizeImageUrl(listing.images?.[0]?.url) || fallbackImage;
  const statusInfo = getStatusInfo(listing.status, listing.fuelType);
  return {
    id: listing.id,
    image,
    name: listing.title || `${listing.brand || ''} ${listing.model || ''}`.trim() || prefs.t('vehicle'),
    year: listing.year,
    tag: statusInfo.label,
    statusBadge: statusInfo.overlay,
    statusClass: statusInfo.className,
    price: listing.price || 0,
  };
}

function getStatusInfo(status?: string | null, fallback?: string | null) {
  const normalized = status?.toUpperCase();
  if (normalized === 'SOLD') {
    return {
      label: prefs.language === 'es' ? 'Vendido' : 'Sold',
      overlay: prefs.language === 'es' ? 'Vendido' : 'Sold',
      className: 'status-sold',
    };
  }
  if (normalized === 'RESERVED') {
    return {
      label: prefs.language === 'es' ? 'Reservado' : 'Reserved',
      overlay: prefs.language === 'es' ? 'Reservado' : 'Reserved',
      className: 'status-reserved',
    };
  }
  return {
    label: fallback || prefs.t('available'),
    overlay: '',
    className: 'status-available',
  };
}

function goToCar(id: string | number) {
  router.push(`/car/${id}`);
}
function goToWishlist() {
  router.push('/tabs/wishlist');
}
function goToSearch() {
  router.push({ path: '/search', query: { q: query.value } });
}
function filterByBrand(brand: string) {
  if (!brand) {
    query.value = '';
    goToSearch();
    return;
  }
  query.value = brand;
  router.push({ path: '/search/results', query: { brand } });
}
function formatPrice(n: number) {
  return n.toLocaleString('es-ES');
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

.state-block,
.empty-block {
  min-height: 240px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #636a73;
  gap: 12px;
}
.empty-block h3 {
  margin: 0;
  color: #202127;
}
.empty-block p,
.state-block p {
  margin: 0;
}

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
.status-overlay {
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
  border-radius: 999px;
  padding: 5px 10px;
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 0 8px 18px rgba(31, 34, 42, 0.18);
}
.status-overlay.status-sold,
.card-badge.status-sold {
  background: #1f222a;
  color: #ffffff;
}
.status-overlay.status-reserved,
.card-badge.status-reserved {
  background: #fff3cd;
  color: #8a5a00;
}
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
</style>