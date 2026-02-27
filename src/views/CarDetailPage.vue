<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" text="Back" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="car" fill="clear" @click="toggleWish">
            <ion-icon slot="icon-only" :icon="wishlist.isInWishlist(car.id) ? heart : heartOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="car">
      <div class="hero">
        <Swiper ref="swiperRef" class="car-swiper" :loop="false" @slideChange="onSlideChange">
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
            <div v-for="(img, i) in gallery" :key="i" class="gallery-item">
              <img :src="img" :alt="`${car.brand} gallery ${i + 1}`" />
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Seller Information</h3>
          <div class="seller-card">
            <div class="seller-info">
              <div class="seller-logo">BMW</div>
              <div class="seller-text">
                <strong class="seller-name">{{ car.brand }} Store</strong>
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

          <h3 style="margin-top: 20px;">Seller Location</h3>
          <div ref="mapEl" class="map-container"></div>
        </div>
      </div>
    </ion-content>

    <ion-footer v-if="car" class="ion-no-border footer">
      <div class="price">${{ formatPrice(car.price) }}</div>
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

import { callOutline, chatbubbleOutline, heart, heartOutline, star } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const car = computed(() => CARS.find((c) => c.id === String(route.params.id)));
const gallery = computed(() => (car.value ? car.value.images : []));
const listed = computed(() => dayjs().format('DD MMM YYYY'));

const swiperRef = ref<any>(null);
const currentSlide = ref(0);
const mapEl = ref<HTMLElement | null>(null);
let sellerMap: MapLibreMap | null = null;

function onSlideChange(swiper: any) {
  currentSlide.value = swiper.realIndex;
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
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  background: #f7f7f7;
  padding: 24px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  position: relative;
}

.car-swiper {
  width: 100%;
}

.pager {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.pager span {
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

.pager span.active {
  background: rgba(0, 0, 0, 0.6);
}

.car-img {
  width: 100%;
  max-width: 400px;
  height: 280px;
  object-fit: contain;
}

.content-section {
  padding: 16px;
}

.title {
  margin: 20px 0 4px;
  font-size: 32px;
  font-weight: 900;
  color: #1a1a1a;
}

.listed {
  font-size: 12px;
  color: #999;
  margin: 0 0 8px;
}

.subtitle {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #666;
  font-size: 13px;
  margin-bottom: 16px;
}

.condition-badge {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
  color: #1a1a1a;
  font-weight: 600;
}

.rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rating ion-icon {
  color: #ff9500;
  font-size: 13px;
}

.section {
  margin: 20px 0;
}

.section h3 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 10px;
  color: #1a1a1a;
}

.description {
  color: #666;
  font-size: 12px;
  line-height: 1.6;
}

.gallery {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;
}

.gallery-item {
  flex-shrink: 0;
  width: 80px;
  height: 60px;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.seller-card {
  background: #f8f8f8;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.seller-logo {
  width: 50px;
  height: 50px;
  background: #1a1a1a;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 12px;
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
}

.seller-name {
  display: block;
  font-size: 14px;
  color: #1a1a1a;
  margin: 0;
}

.seller-type {
  margin: 4px 0 0;
  font-size: 12px;
  color: #999;
}

.seller-actions {
  display: flex;
  gap: 6px;
}

.map-container {
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid #eee;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 20px;
  background: #fff;
  border-top: 1px solid #f0f0f0;
}

.price {
  font-size: 24px;
  font-weight: 900;
  color: #1a1a1a;
}

.buy-btn {
  --background: #1a1a1a;
  --border-radius: 28px;
  font-weight: 700;
  padding: 0 24px;
}
</style>
