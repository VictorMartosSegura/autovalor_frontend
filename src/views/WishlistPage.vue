<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar class="wishlist-toolbar">
        <div class="topbar">
          <div class="left">
            <ion-button fill="clear" size="small" class="back-btn" @click="goBack">
              <ion-icon :icon="arrowBackOutline" />
            </ion-button>
            <h1>{{ prefs.t('myWishlist') }}</h1>
          </div>
          <div class="actions">
            <ion-button fill="clear" size="small" @click="loadFavorites"><ion-icon :icon="heartOutline" /></ion-button>
            <ion-button fill="clear" size="small" @click="router.push('/search')"><ion-icon :icon="searchOutline" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="mobile-safe-content wishlist-content">
      <div v-if="loading" class="empty">
        <ion-spinner name="crescent" />
        <h3>{{ prefs.t('loadingWishlist') }}</h3>
      </div>

      <div v-else-if="errorMessage" class="empty">
        <h3>{{ errorMessage }}</h3>
        <ion-button size="small" @click="loadFavorites">{{ prefs.t('retry') }}</ion-button>
      </div>

      <div v-else-if="!wishCars.length" class="empty">
        <h3>{{ prefs.t('wishlistEmpty') }}</h3>
        <p>{{ prefs.t('addCarsFromHome') }}</p>
      </div>

      <draggable
        v-else
        class="grid"
        :model-value="wishCars"
        item-key="id"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        @update:modelValue="onReorder"
      >
        <template #item="{ element: car }">
          <article class="card" @click="goToCar(car.id)">
            <div class="card-image">
              <img :src="car.image" :alt="car.name" />
              <button class="card-heart" @click.stop="removeFavorite(car.id)">
                <ion-icon :icon="heart" />
              </button>
            </div>
            <div class="card-info">
              <h3>{{ car.name }}</h3>
              <div class="card-meta">
                <span class="rating"><ion-icon :icon="star" /> {{ car.year || 'S/A' }}</span>
                <span class="badge">{{ car.tag }}</span>
              </div>
              <div class="card-price">{{ formatPrice(car.price) }} €</div>
            </div>
          </article>
        </template>
      </draggable>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonSpinner } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { arrowBackOutline, heart, heartOutline, searchOutline, star } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { listingService, normalizeImageUrl } from '@/services/listingService';
import { usePreferencesStore } from '@/stores/preferences';
import draggable from 'vuedraggable';

const router = useRouter();
const wishlist = useWishlistStore();
const auth = useAuthStore();
const prefs = usePreferencesStore();
const loading = ref(false);
const errorMessage = ref('');

const fallbackImage = new URL('../assets/logos/autovalor_logo.png', import.meta.url).href;

const wishCars = computed(() => wishlist.favorites.map((favorite) => {
  const listing = favorite.listing;
  const image = normalizeImageUrl(listing.images?.[0]?.url) || fallbackImage;
  return {
    id: listing.id,
    image,
    name: listing.title || `${listing.brand || ''} ${listing.model || ''}`.trim() || prefs.t('vehicle'),
    year: listing.year,
    tag: listing.status || listing.fuelType || prefs.t('available'),
    price: listing.price || 0,
  };
}));

onMounted(async () => {
  await loadFavorites();
});

async function loadFavorites() {
  await auth.init();
  prefs.init(auth.user?.id);

  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: '/tabs/wishlist' } });
    return;
  }

  loading.value = true;
  errorMessage.value = '';
  try {
    await wishlist.sync(auth.token);
    await Promise.all(wishlist.favorites.map(async (favorite) => {
      const images = await listingService.getImages(favorite.listingId).catch(() => favorite.listing.images || []);
      favorite.listing.images = images;
    }));
  } catch (error: any) {
    errorMessage.value = error?.message || prefs.t('couldNotLoadWishlist');
  } finally {
    loading.value = false;
  }
}

async function removeFavorite(id: string | number) {
  await auth.init();
  if (!auth.token) return;
  await wishlist.toggle(String(id), auth.token);
}

function goToCar(id: string | number) {
  router.push(`/car/${id}`);
}

function goBack() {
  router.back();
}

function onReorder(newOrder: Array<{ id: string | number }>) {
  wishlist.setOrder(newOrder.map((car) => String(car.id)));
}

function formatPrice(n: number) {
  return Number(n || 0).toLocaleString('es-ES');
}
</script>

<style scoped>
.wishlist-toolbar {
  --background: #fff;
  padding: 8px var(--app-page-gutter) 6px;
}

.topbar { display: flex; align-items: center; justify-content: space-between; }
.left { display: flex; align-items: center; gap: 6px; }
.back-btn { --padding-start: 0; --padding-end: 0; --color: #202127; margin: 0; }
h1 { margin: 0; font-size: clamp(24px, 4.2vw, 28px); font-weight: 700; color: #22242b; letter-spacing: -0.02em; }
.actions { display: flex; align-items: center; gap: 2px; }
.actions ion-button { --color: #202127; margin: 0; }
.wishlist-content { --background: #fff; --padding-top: 8px; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; padding: 22px calc(var(--app-page-gutter) + 6px) 24px; }
.card { background: transparent; cursor: pointer; border: 0; margin: 0; text-align: left; }
.card:active { transform: scale(0.97); }
.drag-ghost { opacity: 0.45; }
.drag-chosen { cursor: grabbing; }
.card-image { position: relative; height: 142px; background: #f3f3f5; border-radius: 18px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.card-image img { width: 100%; height: 100%; object-fit: contain; padding: 12px; }
.card-heart { position: absolute; top: 9px; right: 9px; width: 26px; height: 26px; border-radius: 50%; border: none; background: #121318; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); }
.card-heart ion-icon { width: 14px; height: 14px; color: #fff; }
.card-info { padding: 10px 2px 2px; }
.card-info h3 { margin: 0 0 6px; font-size: 17px; font-weight: 700; color: #202127; line-height: 1.05; letter-spacing: -0.02em; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.rating { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #5f626a; }
.rating ion-icon { width: 11px; height: 11px; color: #111216; }
.badge { font-size: 10px; font-weight: 600; padding: 2px 8px; background: #eceef1; color: #4e535d; border-radius: 6px; }
.card-price { font-size: 15px; font-weight: 800; color: #1f222a; }
.empty { min-height: 280px; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; gap: 10px; color: #8e8e93; padding: 30px; }
.empty h3 { font-size: 16px; font-weight: 700; color: #1a1a1a; margin: 0; }
.empty p { font-size: 14px; margin: 0; }

@media (max-width: 430px) {
  h1 { font-size: 26px; }
  .card-info h3 { font-size: 16px; }
}

@media (max-width: 360px) {
  h1 { font-size: 24px; }
  .card-image { height: 124px; }
  .card-info h3 { font-size: 15px; }
}

@media (orientation: landscape) and (max-height: 500px) {
  .wishlist-toolbar { padding-top: 4px; padding-bottom: 4px; }
  h1 { font-size: 24px; }
  .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .card-image { height: 110px; }
  .card-info h3 { font-size: 20px; }
}
</style>