<template>
  <ion-page>
    <ion-header class="ion-no-border detail-header mobile-safe-header">
      <ion-toolbar class="detail-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" text="" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="car" fill="clear" @click="toggleWish">
            <ion-icon slot="icon-only" :icon="wishlist.isInWishlist(String(car.id)) ? heart : heartOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="loading" class="ion-padding detail-state">
      <ion-spinner name="crescent" />
      <p>Loading car...</p>
    </ion-content>

    <ion-content v-else-if="errorMessage" class="ion-padding detail-state">
      <p>{{ errorMessage }}</p>
      <ion-button size="small" @click="loadCar">Retry</ion-button>
    </ion-content>

    <ion-content v-else-if="car" class="detail-content">
      <div class="hero">
        <Swiper ref="swiperRef" class="car-swiper" :loop="false" @swiper="onSwiperInit" @slideChange="onSlideChange">
          <SwiperSlide v-for="(img, idx) in carImages" :key="idx">
            <img :src="img" class="car-img" :alt="`${car.brand} ${car.model}`" />
          </SwiperSlide>
        </Swiper>
        <div v-if="carImages.length > 1" class="pager">
          <span v-for="idx in carImages.length" :key="idx" :class="{ active: currentSlide === idx - 1 }"></span>
        </div>
      </div>

      <div class="content-section">
        <h1 class="title">{{ car.title || `${car.brand} ${car.model}` }}</h1>
        <p class="listed">Listed on {{ listed }}</p>
        <div class="subtitle">
          <span v-if="car.status" class="condition-badge">{{ car.status }}</span>
          <span v-if="car.year" class="detail-chip">{{ car.year }}</span>
          <span v-if="car.km !== undefined && car.km !== null" class="detail-chip">{{ formatKm(car.km) }} km</span>
          <span v-if="car.fuelType" class="detail-chip">{{ car.fuelType }}</span>
        </div>

        <div class="section">
          <h3>Description</h3>
          <p class="description">{{ car.description || 'No description provided.' }}</p>
        </div>

        <div v-if="gallery.length" class="section">
          <h3>Gallery Photos</h3>
          <div class="gallery">
            <button
              v-for="(img, i) in gallery"
              :key="i"
              type="button"
              class="gallery-item"
              :class="{ active: currentSlide === i }"
              @click="goToSlide(i)"
            >
              <img :src="img" :alt="`${car.brand} gallery ${i + 1}`" />
            </button>
          </div>
        </div>

        <div class="section specs-section">
          <h3>Vehicle details</h3>
          <div class="specs-grid">
            <div v-if="car.brand" class="spec-item"><span>Brand</span><strong>{{ car.brand }}</strong></div>
            <div v-if="car.model" class="spec-item"><span>Model</span><strong>{{ car.model }}</strong></div>
            <div v-if="car.transmission" class="spec-item"><span>Transmission</span><strong>{{ car.transmission }}</strong></div>
            <div v-if="car.bodyType" class="spec-item"><span>Body</span><strong>{{ car.bodyType }}</strong></div>
            <div v-if="car.color" class="spec-item"><span>Color</span><strong>{{ car.color }}</strong></div>
            <div v-if="car.doors" class="spec-item"><span>Doors</span><strong>{{ car.doors }}</strong></div>
            <div v-if="car.powerCv" class="spec-item"><span>Power</span><strong>{{ car.powerCv }} CV</strong></div>
            <div v-if="car.engineSize" class="spec-item"><span>Engine</span><strong>{{ car.engineSize }}</strong></div>
            <div v-if="car.environmentalLabel" class="spec-item"><span>Eco label</span><strong>{{ car.environmentalLabel }}</strong></div>
            <div v-if="car.province || car.location" class="spec-item"><span>Location</span><strong>{{ [car.location, car.province].filter(Boolean).join(', ') }}</strong></div>
          </div>
        </div>

        <div class="section seller-section">
          <div class="seller-card">
            <div class="seller-info">
              <img class="seller-logo" :src="sellerLogo" alt="Seller logo" />
              <div class="seller-text">
                <strong class="seller-name">
                  {{ car.userName || car.sellerType || 'Seller' }}
                  <ion-icon class="verified-icon" :icon="checkmarkCircle" />
                </strong>
                <p class="seller-type">{{ car.sellerType || 'Private seller' }}</p>
              </div>
              <div class="seller-actions">
                <ion-button fill="clear" size="small">
                  <ion-icon :icon="chatbubbleOutline" />
                </ion-button>
                <ion-button fill="clear" size="small">
                  <ion-icon :icon="callOutline" />
                </ion-button>
              </div>
            </div>
          </div>

          <h3 class="seller-location-title">Seller Location</h3>
          <div ref="mapEl" class="map-container"></div>
        </div>
      </div>
    </ion-content>

    <ion-footer v-if="car" class="ion-no-border footer">
      <div class="price-block">
        <span class="price-label">Price</span>
        <div class="price">{{ formatPrice(car.price) }} €</div>
      </div>
      <ion-button class="buy-btn" @click="goToOffer">Contact seller</ion-button>
    </ion-footer>

    <ion-content v-else class="ion-padding detail-state"><p>Car not found</p></ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonToolbar,
} from '@ionic/vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import { callOutline, chatbubbleOutline, checkmarkCircle, heart, heartOutline } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';
import autovalorLogo from '@/assets/logos/autovalor_logo.png';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();

const car = ref<ListingResponse | null>(null);
const loading = ref(false);
const errorMessage = ref('');
const swiperRef = ref<any>(null);
const swiperInstance = ref<any>(null);
const currentSlide = ref(0);
const mapEl = ref<HTMLElement | null>(null);
let sellerMap: MapLibreMap | null = null;

const fallbackImage = autovalorLogo;
const sellerLogo = autovalorLogo;
const listed = computed(() => car.value?.createdAt ? dayjs(car.value.createdAt).format('DD MMM YYYY') : dayjs().format('DD MMM YYYY'));
const carImages = computed(() => {
  const images = car.value?.images?.map((image) => normalizeImageUrl(image.url)).filter(Boolean) || [];
  return images.length ? images : [fallbackImage];
});
const gallery = computed(() => carImages.value);

onMounted(async () => {
  await wishlist.init();
  await loadCar();
});

onBeforeUnmount(() => {
  destroySellerMap();
});

async function loadCar() {
  loading.value = true;
  errorMessage.value = '';
  car.value = null;
  currentSlide.value = 0;
  destroySellerMap();

  try {
    car.value = await listingService.getById(String(route.params.id));
    await nextTick();
    initSellerMap();
  } catch (error: any) {
    errorMessage.value = error?.message || 'Car not found.';
  } finally {
    loading.value = false;
  }
}

function onSlideChange(swiper: any) {
  currentSlide.value = swiper.realIndex;
}

function onSwiperInit(swiper: any) {
  swiperInstance.value = swiper;
}

function goToSlide(index: number) {
  const swiper = swiperInstance.value ?? swiperRef.value?.swiper;
  if (!swiper) return;
  swiper.slideTo(index);
  currentSlide.value = index;
}

function initSellerMap() {
  if (!mapEl.value || !car.value || sellerMap) return;

  sellerMap = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://demotiles.maplibre.org/style.json',
    center: [-3.7038, 40.4168],
    zoom: 5,
    attributionControl: {},
  });

  new maplibregl.Marker({ color: '#356db7' }).setLngLat([-3.7038, 40.4168]).addTo(sellerMap);

  sellerMap.on('load', () => {
    sellerMap?.resize();
  });

  window.setTimeout(() => {
    sellerMap?.resize();
  }, 180);
}

function destroySellerMap() {
  if (sellerMap) {
    sellerMap.remove();
    sellerMap = null;
  }
}

function goToOffer() {
  router.push(`/offer/${route.params.id}`);
}

function toggleWish() {
  if (car.value) wishlist.toggle(String(car.value.id));
}

function formatPrice(n: number) {
  return Number(n || 0).toLocaleString('es-ES');
}

function formatKm(n: number) {
  return Number(n || 0).toLocaleString('es-ES');
}
</script>

<style scoped>
.detail-state {
  --background: #ffffff;
  color: #636a73;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero {
  background: #f6f6f7;
  margin: 20px 14px 0;
  border-radius: 22px;
  padding: 18px 10px 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.detail-toolbar {
  --background: #fff;
  --padding-start: 10px;
  --padding-end: 10px;
  --padding-top: var(--app-safe-top);
  --min-height: 68px;
}

.detail-toolbar ion-buttons[slot="start"],
.detail-toolbar ion-buttons[slot="end"] {
  margin-top: 14px;
}

.detail-header ion-back-button {
  --color: #1f222a;
}

.detail-header ion-button {
  --color: #1f222a;
}

.detail-content {
  --padding-top: 6px;
  --background: #ffffff;
}

.car-swiper {
  width: 100%;
}

.pager {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 7px;
}

.pager span {
  width: 9px;
  height: 9px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.pager span.active {
  background: rgba(0, 0, 0, 0.6);
}

.car-img {
  width: 100%;
  max-width: 340px;
  height: 210px;
  object-fit: contain;
}

.content-section {
  padding: 10px 18px 0;
}

.title {
  margin: 18px 0 2px;
  font-size: clamp(30px, 8vw, 38px);
  line-height: 0.98;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: #1a1a1a;
}

.listed {
  font-size: 12px;
  color: #969aa2;
  margin: 0 0 10px;
}

.subtitle {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
  color: #6b7179;
  font-size: 13px;
  margin-bottom: 18px;
}

.condition-badge,
.detail-chip {
  background: #eff0f2;
  padding: 5px 11px;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 700;
}

.section {
  margin: 18px 0;
}

.section h3 {
  font-size: 16px;
  line-height: 1.15;
  font-weight: 700;
  letter-spacing: 0;
  margin: 0 0 12px;
  color: #1a1a1a;
}

.description {
  color: #636a73;
  font-size: 13px;
  line-height: 1.45;
  margin: 0;
}

.gallery {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.gallery-item {
  flex-shrink: 0;
  width: 68px;
  height: 42px;
  background: #efeff1;
  border-radius: 8px;
  padding: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-item.active {
  border-color: #1f222a;
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.spec-item {
  background: #f6f6f7;
  border-radius: 14px;
  padding: 12px;
}

.spec-item span {
  display: block;
  color: #969aa2;
  font-size: 11px;
  margin-bottom: 4px;
}

.spec-item strong {
  color: #1a1a1a;
  font-size: 13px;
}

.seller-card {
  background: #f5f5f6;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.seller-logo {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  object-fit: contain;
  padding: 4px;
  border: 1px solid #e7e7ea;
  background: #fff;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.seller-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  flex: 1;
  min-width: 0;
}

.seller-name {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
}

.verified-icon {
  color: #2378ff;
  font-size: 11px;
  transform: translateY(1px);
}

.seller-type {
  margin: 0;
  font-size: 12px;
  color: #8a8f97;
  line-height: 1.2;
}

.seller-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.seller-actions ion-button {
  --color: #1c2128;
  --padding-start: 6px;
  --padding-end: 6px;
  min-height: 30px;
  min-width: 30px;
  margin: 0;
}

.seller-section {
  margin-top: 20px;
}

.seller-location-title {
  margin-top: 16px !important;
}

.map-container {
  width: 100%;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  margin-top: 4px;
  border: 1px solid #eee;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.price-label {
  font-size: 12px;
  color: #9a9ea6;
}

.price {
  font-size: clamp(28px, 8vw, 40px);
  line-height: 1;
  letter-spacing: -0.03em;
  font-weight: 800;
  color: #1a1a1a;
}

.buy-btn {
  --background: #1a1a1a;
  --border-radius: 999px;
  --padding-start: 28px;
  --padding-end: 28px;
  font-weight: 700;
  min-height: 46px;
}

@media (max-width: 430px) {
  .hero {
    margin-top: 14px;
    padding: 14px 8px 22px;
  }

  .car-img {
    height: 182px;
  }

  .title {
    font-size: clamp(26px, 9vw, 32px);
  }

  .footer {
    padding: 10px 14px 16px;
  }

  .buy-btn {
    --padding-start: 20px;
    --padding-end: 20px;
    min-height: 44px;
  }
}

@media (max-width: 360px) {
  .content-section {
    padding: 8px 14px 0;
  }

  .subtitle {
    gap: 8px;
    font-size: 12px;
  }

  .seller-name {
    font-size: 13px;
  }

  .price {
    font-size: 26px;
  }
}

@media (min-width: 768px) {
  .hero,
  .content-section,
  .footer {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
