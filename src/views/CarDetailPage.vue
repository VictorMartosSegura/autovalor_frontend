<template>
  <ion-page>
    <ion-header class="ion-no-border detail-header mobile-safe-header">
      <ion-toolbar class="detail-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" text="" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="car" fill="clear" @click="toggleWish">
            <ion-icon slot="icon-only" :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="car" class="detail-content">
      <div class="hero">
        <Swiper ref="swiperRef" class="car-swiper" :loop="false" @swiper="onSwiperInit" @slideChange="onSlideChange">
          <SwiperSlide v-for="(img, idx) in car.images" :key="idx">
            <img :src="img" class="car-img" :alt="`${car.brand} ${car.model}`" />
          </SwiperSlide>
        </Swiper>
        <div class="pager">
          <span v-for="idx in car.images.length" :key="idx" :class="{ active: currentSlide === idx - 1 }"></span>
        </div>
      </div>

      <div class="content-section">
        <h1 class="title">{{ car.brand }} {{ car.model }}</h1>
        <p class="listed">Listed on {{ listed }}</p>
        <div class="subtitle">
          <span v-if="car.condition" class="condition-badge">{{ car.condition }}</span>
          <span class="rating">
            <ion-icon :icon="star" /> {{ car.rating }} (86 reviews)
          </span>
        </div>

        <div class="section">
          <h3>Description</h3>
          <p class="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div class="section">
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

        <div class="section seller-section">
          <div class="seller-card">
            <div class="seller-info">
              <img class="seller-logo" :src="sellerLogo" :alt="`${car.brand} logo`" />
              <div class="seller-text">
                <strong class="seller-name">
                  {{ car.brand }} Store
                  <ion-icon v-if="hasVerifiedBadge" class="verified-icon" :icon="checkmarkCircle" />
                </strong>
                <p class="seller-type">Official Dealer</p>
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
        <div class="price">${{ formatPrice(car.price) }}</div>
      </div>
      <ion-button class="buy-btn" @click="goToOffer">Buy the car</ion-button>
    </ion-footer>

    <ion-content v-else class="ion-padding"><p>Car not found</p></ion-content>
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
  IonToolbar,
} from '@ionic/vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import { CARS } from '@/data/cars';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

import { callOutline, chatbubbleOutline, checkmarkCircle, heart, heartOutline, star } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';
import bmwStoreLogo from '@/assets/logos/bmwStore.png';
import camaroStoreLogo from '@/assets/logos/camaroStore.png';
import ferrariStoreLogo from '@/assets/logos/ferrariStore.png';
import jaguarStoreLogo from '@/assets/logos/jaguarStore.png';
import lamborghiniStoreLogo from '@/assets/logos/lamborghiniStore.png';
import mclarenStoreLogo from '@/assets/logos/mclarenStore.png';
import subaruStoreLogo from '@/assets/logos/subaruStore.png';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const car = computed(() => CARS.find((c) => c.id === String(route.params.id)));
const gallery = computed(() => (car.value ? car.value.images : []));
const listed = computed(() => dayjs().format('DD MMM YYYY'));
const sellerLogo = computed(() => {
  if (!car.value) return bmwStoreLogo;

  const logosByBrand: Record<string, string> = {
    bmw: bmwStoreLogo,
    ferrari: ferrariStoreLogo,
    chevrolet: camaroStoreLogo,
    jaguar: jaguarStoreLogo,
    lamborghini: lamborghiniStoreLogo,
    mclaren: mclarenStoreLogo,
    subaru: subaruStoreLogo,
  };

  return logosByBrand[car.value.brand.toLowerCase()] ?? bmwStoreLogo;
});
const hasVerifiedBadge = computed(() => Boolean(car.value));

const swiperRef = ref<any>(null);
const swiperInstance = ref<any>(null);
const currentSlide = ref(0);
const mapEl = ref<HTMLElement | null>(null);
let sellerMap: MapLibreMap | null = null;

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

const sellerLocations: Record<string, [number, number]> = {
  ferrari: [43.0761, 12.5673],
  bmw: [48.1351, 11.582],
  chevrolet: [42.3314, -83.0458],
  mclaren: [51.5074, -0.1278],
  bugatti: [47.6062, 7.2284],
  jaguar: [52.4862, -1.8904],
  subaru: [35.0116, 135.7681],
  lamborghini: [45.5833, 11.3667],
};

onMounted(async () => {
  await nextTick();
  initSellerMap();
});

onBeforeUnmount(() => {
  if (sellerMap) {
    sellerMap.remove();
    sellerMap = null;
  }
});

function initSellerMap() {
  if (!mapEl.value || !car.value || sellerMap) return;

  const brand = car.value.brand.toLowerCase();
  const coords = sellerLocations[brand] || [40.4168, -3.7038];

  sellerMap = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://demotiles.maplibre.org/style.json',
    center: coords,
    zoom: 10,
    attributionControl: {},
  });

  new maplibregl.Marker({ color: '#356db7' }).setLngLat(coords).addTo(sellerMap);

  sellerMap.on('load', () => {
    sellerMap?.resize();
  });

  window.setTimeout(() => {
    sellerMap?.resize();
  }, 180);
}

function goToOffer() {
  router.push(`/offer/${route.params.id}`);
}

function toggleWish() {
  if (car.value) wishlist.toggle(car.value.id);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>

<style scoped>
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
  gap: 12px;
  align-items: center;
  color: #6b7179;
  font-size: 13px;
  margin-bottom: 18px;
}

.condition-badge {
  background: #eff0f2;
  padding: 5px 11px;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 12px;
  font-weight: 700;
}

.rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rating ion-icon {
  color: #ff9500;
  font-size: 14px;
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
  object-fit: contain;
}

.gallery-item.active {
  border-color: #1f222a;
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
