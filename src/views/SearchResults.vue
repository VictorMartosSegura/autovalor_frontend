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
            <button type="button" class="filter-btn" @click="showFilters = true">
              <ion-icon :icon="optionsOutline" class="filter-icon" />
              <span v-if="activeFilterCount" class="filter-count">{{ activeFilterCount }}</span>
            </button>
          </div>
        </div>

        <div class="result-head">
          <p class="result-title">Results for "{{ query || filters.brand || 'All cars' }}"</p>
          <p class="result-count">{{ matchesCount }} found</p>
        </div>

        <div v-if="activeFilterLabels.length" class="active-filters">
          <button v-for="label in activeFilterLabels" :key="label.key" type="button" class="filter-chip" @click="clearFilter(label.key)">
            {{ label.text }} ×
          </button>
          <button type="button" class="clear-filters" @click="resetFilters">Clear</button>
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
          <p>Try another search or change filters.</p>
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

      <div v-if="showFilters" class="sheet-backdrop" @click.self="showFilters = false">
        <section class="filter-sheet">
          <div class="sheet-handle"></div>
          <div class="sheet-head">
            <h2>Filter cars</h2>
            <button type="button" @click="showFilters = false">Close</button>
          </div>

          <div class="filter-group">
            <label>Brand</label>
            <select v-model="draftFilters.brand">
              <option value="">Any brand</option>
              <option v-for="brand in brandOptions" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Min price</label>
              <input v-model.number="draftFilters.minPrice" type="number" min="0" placeholder="0" />
            </div>
            <div class="filter-group">
              <label>Max price</label>
              <input v-model.number="draftFilters.maxPrice" type="number" min="0" placeholder="300000" />
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Min year</label>
              <input v-model.number="draftFilters.minYear" type="number" min="1900" placeholder="2018" />
            </div>
            <div class="filter-group">
              <label>Max year</label>
              <input v-model.number="draftFilters.maxYear" type="number" min="1900" placeholder="2026" />
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Min km</label>
              <input v-model.number="draftFilters.minKm" type="number" min="0" placeholder="0" />
            </div>
            <div class="filter-group">
              <label>Max km</label>
              <input v-model.number="draftFilters.maxKm" type="number" min="0" placeholder="100000" />
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Fuel</label>
              <select v-model="draftFilters.fuelType">
                <option value="">Any fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Transmission</label>
              <select v-model="draftFilters.transmission">
                <option value="">Any</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>
          </div>

          <div class="filter-row">
            <div class="filter-group">
              <label>Body</label>
              <select v-model="draftFilters.bodyType">
                <option value="">Any body</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
              </select>
            </div>
            <div class="filter-group">
              <label>Sort by</label>
              <select v-model="draftFilters.sort">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: low to high</option>
                <option value="price_desc">Price: high to low</option>
                <option value="year_desc">Year: newest</option>
                <option value="year_asc">Year: oldest</option>
                <option value="km_asc">Km: low to high</option>
                <option value="km_desc">Km: high to low</option>
              </select>
            </div>
          </div>

          <div class="sheet-actions">
            <button type="button" class="reset-btn" @click="resetDraftFilters">Reset</button>
            <button type="button" class="apply-btn" @click="applyFilters">Apply filters</button>
          </div>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonInput, IonPage, IonSpinner } from '@ionic/vue';
import { arrowBackOutline, heart, heartOutline, optionsOutline, searchOutline, star } from 'ionicons/icons';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { listingService, normalizeImageUrl, type ListingResponse, type ListingSearchParams } from '@/services/listingService';

type FilterKey = 'brand' | 'minPrice' | 'maxPrice' | 'minYear' | 'maxYear' | 'minKm' | 'maxKm' | 'fuelType' | 'transmission' | 'bodyType' | 'sort';
type FilterState = Record<FilterKey, string | number | undefined>;

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
const auth = useAuthStore();

const query = ref(String(route.query.q ?? ''));
const listings = ref<ListingResponse[]>([]);
const totalElements = ref(0);
const loading = ref(false);
const errorMessage = ref('');
const showFilters = ref(false);
const fallbackImage = new URL('../assets/logos/autovalor_logo.png', import.meta.url).href;

const brandOptions = ['BMW', 'Audi', 'Volkswagen', 'Chevrolet', 'Ferrari', 'Jaguar', 'Lamborghini', 'McLaren', 'Subaru', 'Toyota', 'Tesla', 'Mercedes'];
const filters = reactive<FilterState>(emptyFilters());
const draftFilters = reactive<FilterState>(emptyFilters());

onMounted(async () => {
  await auth.init();
  await wishlist.init(auth.token);
  readFiltersFromRoute();
  showFilters.value = route.query.openFilters === 'true';
  await loadResults();
});

watch(
  () => route.query,
  async () => {
    query.value = String(route.query.q ?? '');
    readFiltersFromRoute();
    showFilters.value = route.query.openFilters === 'true';
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
const activeFilterCount = computed(() => activeFilterLabels.value.filter((item) => item.key !== 'sort').length);
const activeFilterLabels = computed(() => {
  const labels: Array<{ key: FilterKey; text: string }> = [];
  if (filters.brand) labels.push({ key: 'brand', text: String(filters.brand) });
  if (filters.minPrice) labels.push({ key: 'minPrice', text: `Min ${formatPrice(Number(filters.minPrice))} €` });
  if (filters.maxPrice) labels.push({ key: 'maxPrice', text: `Max ${formatPrice(Number(filters.maxPrice))} €` });
  if (filters.minYear) labels.push({ key: 'minYear', text: `From ${filters.minYear}` });
  if (filters.maxYear) labels.push({ key: 'maxYear', text: `Until ${filters.maxYear}` });
  if (filters.minKm) labels.push({ key: 'minKm', text: `Min ${formatKm(Number(filters.minKm))} km` });
  if (filters.maxKm) labels.push({ key: 'maxKm', text: `Max ${formatKm(Number(filters.maxKm))} km` });
  if (filters.fuelType) labels.push({ key: 'fuelType', text: String(filters.fuelType) });
  if (filters.transmission) labels.push({ key: 'transmission', text: String(filters.transmission) });
  if (filters.bodyType) labels.push({ key: 'bodyType', text: String(filters.bodyType) });
  if (filters.sort && filters.sort !== 'newest') labels.push({ key: 'sort', text: sortLabel(String(filters.sort)) });
  return labels;
});

async function loadResults() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const response = await listingService.list(buildSearchParams());
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

function buildSearchParams(): ListingSearchParams {
  return {
    q: query.value,
    brand: stringValue(filters.brand),
    minPrice: numberValue(filters.minPrice),
    maxPrice: numberValue(filters.maxPrice),
    minYear: numberValue(filters.minYear),
    maxYear: numberValue(filters.maxYear),
    minKm: numberValue(filters.minKm),
    maxKm: numberValue(filters.maxKm),
    fuelType: stringValue(filters.fuelType),
    transmission: stringValue(filters.transmission),
    bodyType: stringValue(filters.bodyType),
    page: 0,
    size: 50,
    sort: stringValue(filters.sort) || 'newest',
  };
}

function applySearch() {
  router.replace({ path: '/search/results', query: buildRouteQuery() });
}

function applyFilters() {
  copyFilters(draftFilters, filters);
  showFilters.value = false;
  router.replace({ path: '/search/results', query: buildRouteQuery() });
}

function resetFilters() {
  copyFilters(emptyFilters(), filters);
  copyFilters(emptyFilters(), draftFilters);
  router.replace({ path: '/search/results', query: query.value ? { q: query.value } : {} });
}

function resetDraftFilters() {
  copyFilters(emptyFilters(), draftFilters);
}

function clearFilter(key: FilterKey) {
  filters[key] = key === 'sort' ? 'newest' : '';
  copyFilters(filters, draftFilters);
  router.replace({ path: '/search/results', query: buildRouteQuery() });
}

function buildRouteQuery() {
  const result: Record<string, string> = {};
  if (query.value.trim()) result.q = query.value.trim();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== '' && !(key === 'sort' && value === 'newest')) {
      result[key] = String(value);
    }
  });
  return result;
}

function readFiltersFromRoute() {
  const next = emptyFilters();
  (Object.keys(next) as FilterKey[]).forEach((key) => {
    if (key === 'sort') return;
    const value = route.query[key];
    next[key] = Array.isArray(value) ? String(value[0] ?? '') : String(value ?? '');
  });
  const sortValue = route.query.sort;
  next.sort = Array.isArray(sortValue) ? String(sortValue[0] ?? 'newest') : String(sortValue ?? 'newest');
  copyFilters(next, filters);
  copyFilters(next, draftFilters);
}

function emptyFilters(): FilterState {
  return {
    brand: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minKm: '',
    maxKm: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    sort: 'newest',
  };
}

function copyFilters(from: FilterState, to: FilterState) {
  (Object.keys(to) as FilterKey[]).forEach((key) => {
    to[key] = from[key];
  });
}

function stringValue(value: string | number | undefined) {
  return value === undefined || value === null || String(value).trim() === '' ? undefined : String(value).trim();
}

function numberValue(value: string | number | undefined) {
  if (value === undefined || value === null || String(value).trim() === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function goBack() { router.back(); }
function goToCar(id: string | number) { router.push(`/car/${id}`); }

async function toggleWish(id: string | number) {
  await auth.init();
  if (!auth.token) {
    router.push({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }
  await wishlist.toggle(String(id), auth.token);
}

function formatPrice(n: number) { return Number(n || 0).toLocaleString('es-ES'); }
function formatKm(n: number) { return Number(n || 0).toLocaleString('es-ES'); }
function sortLabel(value: string) {
  const labels: Record<string, string> = {
    price_asc: 'Cheapest first',
    price_desc: 'Most expensive',
    year_desc: 'Newest year',
    year_asc: 'Oldest year',
    km_asc: 'Lowest km',
    km_desc: 'Highest km',
  };
  return labels[value] || 'Newest';
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
.filter-btn { position: relative; border: 0; background: transparent; display: grid; place-items: center; width: 28px; height: 28px; padding: 0; }
.filter-count { position: absolute; top: -5px; right: -5px; min-width: 16px; height: 16px; padding: 0 4px; border-radius: 999px; background: #111216; color: #fff; font-size: 10px; line-height: 16px; font-weight: 800; }
.result-head { margin-top: 14px; display: flex; justify-content: space-between; align-items: center; gap: 10px; }
.result-title { margin: 0; font-size: 24px; font-weight: 700; color: #1f222a; line-height: 1.05; }
.result-count { margin: 0; font-size: 14px; font-weight: 700; color: #1f222a; white-space: nowrap; }
.active-filters { display: flex; gap: 8px; overflow-x: auto; padding: 12px 0 2px; }
.filter-chip, .clear-filters { flex: 0 0 auto; border: 0; border-radius: 999px; padding: 7px 10px; font-size: 12px; font-weight: 700; }
.filter-chip { background: #f0f1f3; color: #1f222a; }
.clear-filters { background: #111216; color: #fff; }
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
.sheet-backdrop { position: fixed; inset: 0; z-index: 999; background: rgba(0,0,0,.28); display: flex; align-items: flex-end; }
.filter-sheet { width: 100%; max-height: 86vh; overflow-y: auto; background: #fff; border-radius: 26px 26px 0 0; padding: 10px 16px 18px; box-shadow: 0 -12px 28px rgba(0,0,0,.14); }
.sheet-handle { width: 42px; height: 4px; border-radius: 999px; background: #d7d9df; margin: 0 auto 12px; }
.sheet-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sheet-head h2 { margin: 0; font-size: 22px; color: #1f222a; }
.sheet-head button { border: 0; background: transparent; color: #1f222a; font-weight: 700; }
.filter-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.filter-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
.filter-group label { font-size: 12px; font-weight: 800; color: #60646d; }
.filter-group input, .filter-group select { width: 100%; min-height: 42px; border: 1px solid #e1e3e7; border-radius: 12px; background: #f8f8f9; padding: 0 11px; color: #1f222a; outline: none; font-size: 14px; }
.sheet-actions { display: grid; grid-template-columns: auto 1fr; gap: 10px; position: sticky; bottom: 0; background: #fff; padding-top: 10px; }
.reset-btn, .apply-btn { min-height: 46px; border-radius: 999px; font-weight: 800; border: 0; padding: 0 18px; }
.reset-btn { background: #f0f1f3; color: #1f222a; }
.apply-btn { background: #111216; color: #fff; }
@media (max-width: 360px) { .results-container { padding-left: 12px; padding-right: 12px; } .result-title { font-size: 20px; } .card-image { height: 108px; } .card-name { font-size: 14px; } .filter-row { gap: 8px; } }
@media (min-width: 768px) { .results-container { max-width: 780px; margin: 0 auto; } .results-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } .filter-sheet { max-width: 520px; margin: 0 auto; border-radius: 26px 26px 0 0; } }
</style>
