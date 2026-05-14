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
          <p class="result-title">Results for "{{ query || selectedBrand || 'All cars' }}"</p>
          <p class="result-count">{{ matchesCount }} found</p>
        </div>

        <div v-if="loading" class="state-block">
          <ion-spinner name="crescent" />
          <p>Loading results...</p>
        </div>

        <div v-else-if="errorMessage" class="state-block">
          <p>{{ errorMessage }}</p>
          <ion-button size="small" @click="loadResults">Retry</ion-button>
        </div>

        <div v-else-if="!resultCars.length" class="state-block">
          <h3>No cars found</h3>
          <p>Try another search or brand.</p>
        </div>

        <div v-else class="results-grid">
          <div v-for="car in resultCars" :key="car.id" class="product-card" @click="goToCar(car.id)">
            <div class="card-image">
              <img :src="car.image" :alt="car.name" />
              <button class="card-heart" @click.stop="toggleWish(car.id)">
                <ion-icon :icon="wishlist.isInWishlist(String(car.id)) ? heart : heartOutline" />
              </button>
            </div>
            <div class="card-info">
              <div class="card-name">{{ car.name }}</div>
              <div class="card-meta">
                <span class="card-rating"><ion-icon :icon="star" /> {{ car.year || 'S/A' }}</span>
                <span class="card-badge">{{ car.tag }}</span>
              </div>
              <div class="card-price">{{ formatPrice(car.price) }} €</div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonSpinner } from '@ionic/vue';
import { arrowBackOutline, heart, heartOutline, optionsOutline, searchOutline, star } from 'ionicons/icons';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const query = ref(String(route.query.q ?? ''));
const selectedBrand = ref(String(route.query.brand ?? ''));
const listings = ref<ListingResponse[]>([]);
const totalElements = ref(0);
const loading = ref(false);
const errorMessage = ref('');
const fallbackImage = new URL('../assets/logos/autovalor_logo.png', import.meta.url).href;

onMounted(async () => {
  await auth.init();
  await wishlist.init(auth.token);
  await loadResults();
});

watch(
  () => route.query,
  async () => {
    query.value = String(route.query.q ?? '');
    selectedBrand.value = String(route.query.brand ?? '');
    await loadResults();
  }
);

const resultCars = computed(() => listings.value.map((listing) => {
  const image = normalizeImageUrl(listing.images?.[0]?.url) || fallbackImage;
  return {
    id: listing.id,
    image,
    name: listing.title || `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Vehicle',
    year: listing.year,
    tag: listing.status || listing.fuelType || 'Available',
    price: listing.price || 0,
  };
}));

const matchesCount = computed(() => totalElements.value || resultCars.value.length);

async function loadResults() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await listingService.list({
      q: query.value,
      brand: selectedBrand.value,
      page: 0,
      size: 50,
      sort: 'newest',
    });

    const content = Array.isArray(response) ? response : response.content;
    totalElements.value = Array.isArray(response) ? response.length : response.totalElements;

    listings.value = await Promise.all(content.map(async (listing) => {
      const images = await listingService.getImages(listing.id).catch(() => listing.images || []);
      return { ...listing, images };
    }));
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load search results.';
  } finally {
    loading.value = false;
  }
}

function applySearch() {
  router.replace({ path: '/search/results', query: { q: query.value } });
}

function goBack() {
  router.back();
}

function goToCar(id: string | number) {
  router.push(`/car/${id}`);
}

async function toggleWish(id: string | number) {
  await auth.init();
  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }
  await wishlist.toggle(String(id), auth.token);
}

function formatPrice(n: number) {
  return Number(n || 0).toLocaleString('es-ES');
}
</script>

<style scoped>
.results-page { --background: #ffffff; }
.results-container { min-height: 100%; padding: 42px 16px 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.search-top-row { display: flex; align-items: center; gap: 8px; }
.back-btn { --color: #1f222a; --padding-start: 0; --padding-end: 0; margin: 0; }
.search-input-wrap { flex: 1; height: 42px; border-radius: 10px; background: #f5f6f7; display: flex; align-items: center; gap: 8px; padding: 0 10px; }
.search-icon, .filter-icon { font-size: 18px; color: #6f727a; }
.search-input { flex: 1; --color: #1f222a; --placeholder-color: #a4a6ad; --placeholder-opacity: 1; font-size: 14px; }
.result-head { margin-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.result-title { margin: 0; font-size: 24px; font-weight: 700; color: #1f222a; line-height: 1.05; }
.result-count { margin: 0; font-size: 14px; font-weight: 700; color: #1f222a; white-space: nowrap; }
.state-block { min-height: 260px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; color: #7d8088; }
.state-block h3, .state-block p { margin: 0; }
.results-grid { margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.product-card { background: #f6f6f7; border-radius: 16px; overflow: hidden; cursor: pointer; }
.card-image { position: relative; height: 120px; display: flex; align-items: center; justify-content: center; padding: 10px; }
.card-image img { width: 100%; height: 100%; object-fit: contain; }
.card-heart { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; border: 0; background: #fff; display: grid; place-items: center; }
.card-heart ion-icon { font-size: 14px; color: #e11d48; }
.card-info { padding: 10px; }
.card-name { font-size: 15px; font-weight: 700; color: #1f222a; margin-bottom: 4px; line-height: 1.1; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.card-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #80838a; }
.card-rating ion-icon { font-size: 12px; color: #ff9500; }
.card-badge { background: #eceeef; border-radius: 6px; padding: 2px 7px; font-size: 10px; color: #666a72; font-weight: 700; }
.card-price { font-size: 15px; font-weight: 800; color: #1f222a; }

@media (max-width: 360px) {
  .results-container { padding-left: 12px; padding-right: 12px; }
  .result-title { font-size: 20px; }
  .card-image { height: 108px; }
  .card-name { font-size: 14px; }
}

@media (min-width: 768px) {
  .results-container { max-width: 780px; margin: 0 auto; }
  .results-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
