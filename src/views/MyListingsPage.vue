<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header listings-header">
      <ion-toolbar>
        <div class="topbar">
          <div class="left">
            <ion-button fill="clear" size="small" class="back-btn" @click="goBack">
              <ion-icon :icon="arrowBackOutline" />
            </ion-button>
            <h1>My Listings</h1>
          </div>
          <ion-button fill="clear" size="small" class="add-btn" @click="router.push('/tabs/sell')">
            <ion-icon :icon="addOutline" />
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="mobile-safe-content listings-content">
      <ion-refresher slot="fixed" @ionRefresh="refreshListings">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="loading" class="empty">
        <ion-spinner name="crescent" />
        <h3>Loading your listings...</h3>
      </div>

      <div v-else-if="errorMessage" class="empty">
        <h3>{{ errorMessage }}</h3>
        <ion-button size="small" @click="loadListings">Retry</ion-button>
      </div>

      <div v-else-if="!cards.length" class="empty">
        <h3>You do not have listings yet</h3>
        <p>Create your first vehicle listing from the Sell tab.</p>
        <ion-button size="small" @click="router.push('/tabs/sell')">Create listing</ion-button>
      </div>

      <div v-else class="grid">
        <article v-for="car in cards" :key="car.id" class="card" @click="goToCar(car.id)">
          <div class="card-image">
            <img :src="car.image" :alt="car.name" />
            <span class="status-pill" :class="car.status?.toLowerCase()">{{ car.status }}</span>
          </div>
          <div class="card-info">
            <h3>{{ car.name }}</h3>
            <div class="card-meta">
              <span>{{ car.year || 'S/A' }}</span>
              <span>{{ car.km }} km</span>
            </div>
            <div class="card-price">{{ formatPrice(car.price) }} €</div>
          </div>
        </article>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner, IonRefresher, IonRefresherContent } from '@ionic/vue';
import { addOutline, arrowBackOutline } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const listings = ref<ListingResponse[]>([]);
const loading = ref(false);
const errorMessage = ref('');
const fallbackImage = new URL('../assets/logos/autovalor_logo.png', import.meta.url).href;

const cards = computed(() => listings.value.map((listing) => ({
  id: listing.id,
  image: normalizeImageUrl(listing.images?.[0]?.url) || fallbackImage,
  name: listing.title || `${listing.brand || ''} ${listing.model || ''}`.trim() || 'Vehicle',
  year: listing.year,
  km: Number(listing.km || 0).toLocaleString('es-ES'),
  status: listing.status || 'AVAILABLE',
  price: listing.price || 0,
})));

onMounted(async () => {
  await loadListings();
});

async function loadListings() {
  await auth.init();

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/profile/listings' } });
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  try {
    const mine = await listingService.listMine(auth.token);
    listings.value = await Promise.all(mine.map(async (listing) => {
      const images = await listingService.getImages(listing.id).catch(() => listing.images || []);
      return { ...listing, images };
    }));
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load your listings.';
  } finally {
    loading.value = false;
  }
}

async function refreshListings(event: CustomEvent) {
  await loadListings();
  (event.target as HTMLIonRefresherElement).complete();
}

function goToCar(id: string | number) {
  router.push(`/car/${id}`);
}

function goBack() {
  router.back();
}

function formatPrice(n: number) {
  return Number(n || 0).toLocaleString('es-ES');
}
</script>

<style scoped>
.listings-header ion-toolbar {
  --background: #fff;
  --padding-top: var(--app-safe-top);
  --min-height: 78px;
  padding: 8px var(--app-page-gutter) 6px;
}
.topbar { display: flex; align-items: center; justify-content: space-between; }
.left { display: flex; align-items: center; gap: 6px; }
.back-btn, .add-btn { --color: #202127; margin: 0; }
h1 { margin: 0; font-size: clamp(24px, 4.2vw, 28px); font-weight: 700; color: #22242b; letter-spacing: -0.02em; }
.listings-content { --background: #fff; --padding-top: 8px; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 22px calc(var(--app-page-gutter) + 6px) 24px; }
.card { background: transparent; cursor: pointer; border: 0; margin: 0; text-align: left; }
.card:active { transform: scale(0.97); }
.card-image { position: relative; height: 142px; background: #f3f3f5; border-radius: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-image img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
.status-pill { position: absolute; top: 9px; right: 9px; border-radius: 999px; background: #111216; color: #fff; font-size: 10px; font-weight: 800; padding: 5px 8px; text-transform: capitalize; }
.status-pill.reserved { background: #8a5a00; }
.status-pill.sold { background: #4b5563; }
.status-pill.hidden { background: #b42318; }
.card-info { padding: 10px 2px 2px; }
.card-info h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #202127; line-height: 1.05; letter-spacing: -0.02em; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-size: 11px; color: #5f626a; }
.card-price { font-size: 15px; font-weight: 800; color: #1f222a; }
.empty { min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; color: #8e8e93; padding: 30px; }
.empty h3 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; }
.empty p { font-size: 14px; margin: 0; }
@media (max-width: 360px) {
  h1 { font-size: 24px; }
  .card-image { height: 124px; }
  .card-info h3 { font-size: 15px; }
}
@media (min-width: 768px) {
  .grid { max-width: 760px; margin: 0 auto; grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
