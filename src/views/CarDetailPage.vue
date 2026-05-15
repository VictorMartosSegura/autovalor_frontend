<template>
  <ion-page>
    <ion-header class="ion-no-border detail-header mobile-safe-header">
      <ion-toolbar class="detail-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" text="" />
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button v-if="car && !isOwner" fill="clear" @click="toggleWish">
            <ion-icon slot="icon-only" :icon="wishlist.isInWishlist(String(car.id)) ? heart : heartOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="loading" class="ion-padding detail-state">
      <ion-spinner name="crescent" />
      <p>{{ prefs.t('loadingCar') }}</p>
    </ion-content>

    <ion-content v-else-if="errorMessage" class="ion-padding detail-state">
      <p>{{ errorMessage }}</p>
      <ion-button size="small" @click="loadCar">{{ prefs.t('retry') }}</ion-button>
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
        <p class="listed">{{ prefs.t('listedOn') }} {{ listed }}</p>
        <div class="subtitle">
          <span v-if="car.status" class="condition-badge">{{ statusLabel(car.status) }}</span>
          <span v-if="car.year" class="detail-chip">{{ car.year }}</span>
          <span v-if="car.km !== undefined && car.km !== null" class="detail-chip">{{ formatKm(car.km) }} km</span>
          <span v-if="car.fuelType" class="detail-chip">{{ vehicleOptionLabel(car.fuelType) }}</span>
        </div>

        <div v-if="isOwner" class="section manage-section">
          <div class="manage-head">
            <div>
              <h3>{{ prefs.t('manageYourListing') }}</h3>
              <p>{{ prefs.t('manageListingSubtitle') }}</p>
            </div>
            <span class="owner-pill">{{ prefs.t('owner') }}</span>
          </div>
          <div class="status-grid">
            <button v-for="status in statusOptions" :key="status" type="button" class="status-btn" :class="{ active: editStatus === status }" @click="editStatus = status">{{ statusLabel(status) }}</button>
          </div>
          <label class="edit-field"><span>{{ prefs.t('price') }}</span><input v-model.number="editPrice" type="number" min="0" /></label>
          <label class="edit-field"><span>{{ prefs.t('description') }}</span><textarea v-model="editDescription" rows="4"></textarea></label>
          <p v-if="manageMessage" class="manage-message" :class="{ error: manageError }">{{ manageMessage }}</p>
          <div class="manage-actions">
            <button class="save-btn" type="button" :disabled="savingListing" @click="saveOwnerChanges">{{ savingListing ? prefs.t('saving') : prefs.t('saveChanges') }}</button>
            <button class="delete-btn" type="button" :disabled="deletingListing" @click="deleteListing">{{ deletingListing ? prefs.t('deleting') : prefs.t('delete') }}</button>
          </div>
        </div>

        <div class="section">
          <h3>{{ prefs.t('description') }}</h3>
          <p class="description">{{ car.description || prefs.t('noDescriptionProvided') }}</p>
        </div>

        <div v-if="gallery.length" class="section">
          <h3>{{ prefs.t('galleryPhotos') }}</h3>
          <div class="gallery">
            <button v-for="(img, i) in gallery" :key="i" type="button" class="gallery-item" :class="{ active: currentSlide === i }" @click="goToSlide(i)">
              <img :src="img" :alt="`${car.brand} gallery ${i + 1}`" />
            </button>
          </div>
        </div>

        <div class="section specs-section">
          <h3>{{ prefs.t('vehicleDetails') }}</h3>
          <div class="specs-grid">
            <div v-if="car.brand" class="spec-item"><span>{{ prefs.t('brand') }}</span><strong>{{ car.brand }}</strong></div>
            <div v-if="car.model" class="spec-item"><span>{{ prefs.t('model') }}</span><strong>{{ car.model }}</strong></div>
            <div v-if="car.transmission" class="spec-item"><span>{{ prefs.t('transmission') }}</span><strong>{{ vehicleOptionLabel(car.transmission) }}</strong></div>
            <div v-if="car.bodyType" class="spec-item"><span>{{ prefs.t('body') }}</span><strong>{{ vehicleOptionLabel(car.bodyType) }}</strong></div>
            <div v-if="car.color" class="spec-item"><span>{{ prefs.t('color') }}</span><strong>{{ car.color }}</strong></div>
            <div v-if="car.doors" class="spec-item"><span>{{ prefs.t('doors') }}</span><strong>{{ car.doors }}</strong></div>
            <div v-if="car.powerCv" class="spec-item"><span>{{ prefs.t('power') }}</span><strong>{{ car.powerCv }} CV</strong></div>
            <div v-if="car.engineSize" class="spec-item"><span>{{ prefs.t('engine') }}</span><strong>{{ car.engineSize }}</strong></div>
            <div v-if="car.environmentalLabel" class="spec-item"><span>{{ prefs.t('ecoLabel') }}</span><strong>{{ car.environmentalLabel }}</strong></div>
            <div v-if="car.province || car.location" class="spec-item"><span>{{ prefs.t('location') }}</span><strong>{{ [car.location, car.province].filter(Boolean).join(', ') }}</strong></div>
          </div>
        </div>

        <div v-if="!isOwner" class="section seller-section">
          <div class="seller-card">
            <div class="seller-info">
              <img class="seller-logo" :src="sellerLogo" alt="Seller logo" />
              <div class="seller-text">
                <strong class="seller-name">{{ car.userName || car.sellerType || prefs.t('seller') }}<ion-icon class="verified-icon" :icon="checkmarkCircle" /></strong>
                <p class="seller-type">{{ car.sellerType || prefs.t('privateSeller') }}</p>
              </div>
              <div class="seller-actions">
                <ion-button fill="clear" size="small" @click="contactSeller"><ion-icon :icon="chatbubbleOutline" /></ion-button>
                <ion-button fill="clear" size="small"><ion-icon :icon="callOutline" /></ion-button>
              </div>
            </div>
          </div>

          <h3 class="seller-location-title">{{ prefs.t('sellerLocation') }}</h3>
          <p class="seller-location-text">{{ sellerLocationText }}</p>
          <div class="map-frame-wrap">
            <iframe class="map-frame" :src="sellerMapUrl" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer v-if="car" class="ion-no-border footer">
      <div class="price-block"><span class="price-label">{{ prefs.t('price') }}</span><div class="price">{{ formatPrice(car.price) }} €</div></div>
      <div v-if="!isOwner" class="buyer-actions">
        <ion-button class="offer-btn" :disabled="contactLoading" @click="makeOffer">{{ prefs.t('makeOffer') }}</ion-button>
        <ion-button class="buy-btn" :disabled="contactLoading" @click="contactSeller"><ion-spinner v-if="contactLoading" name="crescent" /><span v-else>{{ prefs.t('contact') }}</span></ion-button>
      </div>
      <ion-button v-else class="buy-btn" @click="scrollToManage">{{ prefs.t('manage') }}</ion-button>
    </ion-footer>

    <ion-content v-else class="ion-padding detail-state"><p>{{ prefs.t('carNotFound') }}</p></ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonSpinner, IonToolbar } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import dayjs from 'dayjs';
import { useRoute, useRouter } from 'vue-router';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';
import { callOutline, chatbubbleOutline, checkmarkCircle, heart, heartOutline } from 'ionicons/icons';
import { useWishlistStore } from '@/stores/wishlist';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';
import { chatService } from '@/services/chatService';
import { listingService, listingToPayload, normalizeImageUrl, type ListingImageResponse, type ListingResponse, type ListingStatus } from '@/services/listingService';
import autovalorLogo from '@/assets/logos/autovalor_logo.png';

const route = useRoute();
const router = useRouter();
const wishlist = useWishlistStore();
const auth = useAuthStore();
const prefs = usePreferencesStore();
const car = ref<ListingResponse | null>(null);
const images = ref<ListingImageResponse[]>([]);
const loading = ref(false);
const contactLoading = ref(false);
const savingListing = ref(false);
const deletingListing = ref(false);
const errorMessage = ref('');
const manageMessage = ref('');
const manageError = ref(false);
const editPrice = ref<number>(0);
const editDescription = ref('');
const editStatus = ref<ListingStatus>('AVAILABLE');
const swiperRef = ref<any>(null);
const swiperInstance = ref<any>(null);
const currentSlide = ref(0);
const statusOptions: ListingStatus[] = ['AVAILABLE', 'RESERVED', 'SOLD', 'HIDDEN'];
const fallbackImage = autovalorLogo;
const sellerLogo = autovalorLogo;

const cityCoords: Record<string, [number, number]> = {
  barcelona: [2.1734, 41.3851], madrid: [-3.7038, 40.4168], valencia: [-0.3763, 39.4699], sevilla: [-5.9845, 37.3891], zaragoza: [-0.8891, 41.6488], malaga: [-4.4214, 36.7213], murcia: [-1.1307, 37.9922], palma: [2.6502, 39.5696], bilbao: [-2.935, 43.263], alicante: [-0.4907, 38.3452], girona: [2.8214, 41.9794], tarragona: [1.2445, 41.1189], lleida: [0.62, 41.6176],
};

const listed = computed(() => car.value?.createdAt ? dayjs(car.value.createdAt).format('DD MMM YYYY') : dayjs().format('DD MMM YYYY'));
const isOwner = computed(() => Boolean(auth.user?.id && car.value?.userId && Number(auth.user.id) === Number(car.value.userId)));
const sellerLocationText = computed(() => {
  if (!car.value) return prefs.t('sellerLocationUnavailable');
  const values = [car.value.sellerAddressLine, car.value.sellerAddressCity, car.value.sellerAddressCountry].filter(Boolean);
  return values.length ? values.join(', ') : prefs.t('sellerLocationUnavailable');
});
const sellerCoords = computed<[number, number]>(() => {
  const lon = car.value?.sellerAddressLongitude;
  const lat = car.value?.sellerAddressLatitude;
  if (typeof lon === 'number' && typeof lat === 'number') return [lon, lat];
  const city = (car.value?.sellerAddressCity || '').trim().toLowerCase();
  return cityCoords[city] || [-3.7038, 40.4168];
});
const sellerMapUrl = computed(() => {
  const [lon, lat] = sellerCoords.value;
  const delta = 0.035;
  const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
  const marker = `${lat},${lon}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(marker)}`;
});
const carImages = computed(() => {
  const detailImages = car.value?.images || [];
  const allImages = images.value.length ? images.value : detailImages;
  const urls = allImages.map((image) => normalizeImageUrl(image.url)).filter(Boolean);
  return urls.length ? urls : [fallbackImage];
});
const gallery = computed(() => carImages.value.filter((image) => image !== fallbackImage));

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  await wishlist.init(auth.token);
  await loadCar();
});

async function loadCar() {
  loading.value = true;
  errorMessage.value = '';
  car.value = null;
  images.value = [];
  currentSlide.value = 0;
  try {
    await auth.init();
    const id = String(route.params.id);
    const [listing, listingImages] = await Promise.all([
      listingService.getById(id, auth.token),
      listingService.getImages(id).catch(() => []),
    ]);
    car.value = listing;
    images.value = listingImages;
    syncEditForm(listing);
  } catch (error: any) {
    errorMessage.value = error?.message || prefs.t('carNotFound');
  } finally {
    loading.value = false;
  }
}

function syncEditForm(listing: ListingResponse) {
  editPrice.value = Number(listing.price || 0);
  editDescription.value = listing.description || '';
  editStatus.value = listing.status || 'AVAILABLE';
  manageMessage.value = '';
  manageError.value = false;
}

async function saveOwnerChanges() {
  await auth.init();
  if (!auth.token || !car.value) return;
  savingListing.value = true;
  manageMessage.value = '';
  manageError.value = false;
  try {
    const payload = listingToPayload({ ...car.value, price: Number(editPrice.value || 0), description: editDescription.value });
    const updated = await listingService.update(car.value.id, payload, auth.token);
    const statusUpdated = await listingService.updateStatus(car.value.id, editStatus.value, auth.token);
    car.value = { ...updated, status: statusUpdated.status, images: images.value };
    syncEditForm(car.value);
    manageMessage.value = prefs.t('listingUpdated');
  } catch (error: any) {
    manageError.value = true;
    manageMessage.value = error?.message || prefs.t('couldNotUpdateListing');
  } finally {
    savingListing.value = false;
  }
}

async function deleteListing() {
  await auth.init();
  if (!auth.token || !car.value) return;
  if (!window.confirm(prefs.t('deleteListing'))) return;
  deletingListing.value = true;
  manageMessage.value = '';
  manageError.value = false;
  try {
    await listingService.delete(car.value.id, auth.token);
    router.replace('/profile/listings');
  } catch (error: any) {
    manageError.value = true;
    manageMessage.value = error?.message || prefs.t('couldNotDeleteListing');
  } finally {
    deletingListing.value = false;
  }
}

async function ensureConversation() {
  await auth.init();
  if (!auth.token) { router.push({ path: '/signin', query: { redirect: route.fullPath } }); return null; }
  if (!car.value || isOwner.value) return null;
  return chatService.startForListing(car.value.id, auth.token);
}

async function contactSeller() {
  contactLoading.value = true;
  try {
    const conversation = await ensureConversation();
    if (conversation) router.push(`/chat/${conversation.id}`);
  } catch (error: any) { errorMessage.value = error?.message || prefs.t('couldNotStartConversation'); }
  finally { contactLoading.value = false; }
}

async function makeOffer() {
  await auth.init();
  if (!auth.token) { router.push({ path: '/signin', query: { redirect: route.fullPath } }); return; }
  if (!car.value || isOwner.value) return;
  router.push(`/offer/${car.value.id}/create`);
}

function onSlideChange(swiper: any) { currentSlide.value = swiper.realIndex; }
function onSwiperInit(swiper: any) { swiperInstance.value = swiper; }
function goToSlide(index: number) { const swiper = swiperInstance.value ?? swiperRef.value?.swiper; if (!swiper) return; swiper.slideTo(index); currentSlide.value = index; }
async function toggleWish() { await auth.init(); if (!auth.token) { router.push({ path: '/signin', query: { redirect: route.fullPath } }); return; } if (car.value) await wishlist.toggle(String(car.value.id), auth.token); }
function scrollToManage() { document.querySelector('.manage-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
function statusLabel(status: ListingStatus) {
  const labels = prefs.language === 'es'
    ? { AVAILABLE: 'Disponible', RESERVED: 'Reservado', SOLD: 'Vendido', HIDDEN: 'Oculto' }
    : { AVAILABLE: 'Available', RESERVED: 'Reserved', SOLD: 'Sold', HIDDEN: 'Hidden' };
  return labels[status] || status;
}
function vehicleOptionLabel(value?: string | null) {
  if (!value) return '';
  const labels: Record<string, Record<string, string>> = {
    es: { Petrol: 'Gasolina', Diesel: 'Diésel', Hybrid: 'Híbrido', Electric: 'Eléctrico', Manual: 'Manual', Automatic: 'Automático', Sedan: 'Sedán', SUV: 'SUV', Coupe: 'Coupé', Convertible: 'Descapotable', Hatchback: 'Compacto' },
    en: { Petrol: 'Petrol', Diesel: 'Diesel', Hybrid: 'Hybrid', Electric: 'Electric', Manual: 'Manual', Automatic: 'Automatic', Sedan: 'Sedan', SUV: 'SUV', Coupe: 'Coupe', Convertible: 'Convertible', Hatchback: 'Hatchback' },
  };
  return labels[prefs.language]?.[value] || value;
}
function formatPrice(n: number) { return Number(n || 0).toLocaleString('es-ES'); }
function formatKm(n: number) { return Number(n || 0).toLocaleString('es-ES'); }
</script>

<style scoped>
.detail-state { --background: #ffffff; color: #636a73; display: flex; flex-direction: column; gap: 12px; }
.hero { background: #f6f6f7; margin: 20px 14px 0; border-radius: 22px; padding: 18px 10px 24px; display: flex; justify-content: center; align-items: center; position: relative; }
.detail-toolbar { --background: #fff; --padding-start: 10px; --padding-end: 10px; --padding-top: var(--app-safe-top); --min-height: 68px; }
.detail-toolbar ion-buttons[slot="start"], .detail-toolbar ion-buttons[slot="end"] { margin-top: 14px; }
.detail-header ion-back-button, .detail-header ion-button { --color: #1f222a; }
.detail-content { --padding-top: 6px; --background: #ffffff; }
.car-swiper { width: 100%; }
.pager { position: absolute; bottom: 10px; left: 50%; transform: translateX(-50%); display: flex; gap: 7px; }
.pager span { width: 9px; height: 9px; background: rgba(0, 0, 0, 0.3); border-radius: 50%; }
.pager span.active { background: rgba(0, 0, 0, 0.6); }
.car-img { width: 100%; max-width: 340px; height: 210px; object-fit: cover; border-radius: 18px; }
.content-section { padding: 10px 18px 0; }
.title { margin: 18px 0 2px; font-size: clamp(30px, 8vw, 38px); line-height: 0.98; letter-spacing: -0.02em; font-weight: 800; color: #1a1a1a; }
.listed { font-size: 12px; color: #969aa2; margin: 0 0 10px; }
.subtitle { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; color: #6b7179; font-size: 13px; margin-bottom: 18px; }
.condition-badge, .detail-chip { background: #eff0f2; padding: 5px 11px; border-radius: 8px; color: #1a1a1a; font-size: 12px; font-weight: 700; }
.section { margin: 18px 0; }
.section h3 { font-size: 16px; line-height: 1.15; font-weight: 700; letter-spacing: 0; margin: 0 0 12px; color: #1a1a1a; }
.description { color: #636a73; font-size: 13px; line-height: 1.45; margin: 0; }
.manage-section { background: #f6f6f7; border-radius: 18px; padding: 14px; }
.manage-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
.manage-head h3 { margin-bottom: 3px; }
.manage-head p { margin: 0; color: #70747c; font-size: 12px; }
.owner-pill { background: #111216; color: #fff; border-radius: 999px; padding: 5px 9px; font-size: 11px; font-weight: 800; }
.status-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px; }
.status-btn { min-height: 38px; border: 1px solid #e1e3e7; background: #fff; border-radius: 12px; color: #1f222a; font-weight: 700; }
.status-btn.active { background: #111216; color: #fff; border-color: #111216; }
.edit-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 10px; }
.edit-field span { font-size: 12px; color: #60646d; font-weight: 700; }
.edit-field input, .edit-field textarea { width: 100%; border: 1px solid #e1e3e7; border-radius: 12px; padding: 11px 12px; outline: none; background: #fff; color: #1f222a; font: inherit; }
.edit-field textarea { resize: vertical; min-height: 96px; }
.manage-actions { display: grid; grid-template-columns: 1fr auto; gap: 10px; align-items: center; }
.save-btn, .delete-btn { border: 0; border-radius: 999px; min-height: 44px; font-weight: 800; padding: 0 18px; }
.save-btn { background: #111216; color: #fff; }
.delete-btn { background: #fff; color: #d92d20; border: 1px solid #ffd0d0; }
.save-btn:disabled, .delete-btn:disabled { opacity: 0.55; }
.manage-message { margin: 4px 0 10px; font-size: 13px; color: #027a48; }
.manage-message.error { color: #d92d20; }
.gallery { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.gallery-item { flex-shrink: 0; width: 68px; height: 42px; background: #efeff1; border-radius: 8px; padding: 1px; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; cursor: pointer; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; }
.gallery-item.active { border-color: #1f222a; }
.specs-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.spec-item { background: #f6f6f7; border-radius: 14px; padding: 12px; }
.spec-item span { display: block; color: #969aa2; font-size: 11px; margin-bottom: 4px; }
.spec-item strong { color: #1a1a1a; font-size: 13px; }
.seller-card { background: #f5f5f6; border-radius: 14px; padding: 10px 12px; display: flex; align-items: center; gap: 10px; }
.seller-logo { width: 46px; height: 46px; border-radius: 12px; object-fit: contain; padding: 4px; border: 1px solid #e7e7ea; background: #fff; }
.seller-info { display: flex; align-items: center; gap: 12px; flex: 1; }
.seller-text { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.seller-name { display: flex; align-items: center; gap: 5px; font-size: 14px; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.2; }
.verified-icon { color: #2378ff; font-size: 11px; transform: translateY(1px); }
.seller-type { margin: 0; font-size: 12px; color: #8a8f97; line-height: 1.2; }
.seller-actions { display: flex; align-items: center; gap: 4px; margin-left: auto; }
.seller-actions ion-button { --color: #1c2128; --padding-start: 6px; --padding-end: 6px; min-height: 30px; min-width: 30px; margin: 0; }
.seller-section { margin-top: 20px; }
.seller-location-title { margin-top: 16px !important; margin-bottom: 4px !important; }
.seller-location-text { margin: 0 0 10px; color: #6b7179; font-size: 13px; line-height: 1.35; }
.map-frame-wrap { width: 100%; height: 180px; border-radius: 16px; overflow: hidden; margin-top: 4px; border: 1px solid #eee; background: #f2f3f5; }
.map-frame { width: 100%; height: 100%; border: 0; display: block; }
.footer { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 12px 18px 20px; background: #fff; border-top: 1px solid #f0f0f0; }
.price-block { display: flex; flex-direction: column; gap: 2px; min-width: 105px; }
.price-label { font-size: 12px; color: #9a9ea6; }
.price { font-size: clamp(25px, 7vw, 34px); line-height: 1; letter-spacing: -0.03em; font-weight: 800; color: #1a1a1a; }
.buyer-actions { display: flex; align-items: center; gap: 8px; }
.buy-btn, .offer-btn { --border-radius: 999px; font-weight: 700; min-height: 46px; text-transform: none; }
.buy-btn { --background: #1a1a1a; --padding-start: 22px; --padding-end: 22px; }
.offer-btn { --background: #f0f1f3; --color: #111216; --padding-start: 18px; --padding-end: 18px; }
@media (max-width: 430px) { .hero { margin-top: 14px; padding: 14px 8px 22px; } .car-img { height: 182px; } .title { font-size: clamp(26px, 9vw, 32px); } .footer { padding: 10px 14px 16px; } .buy-btn, .offer-btn { min-height: 44px; --padding-start: 16px; --padding-end: 16px; } }
@media (max-width: 360px) { .content-section { padding: 8px 14px 0; } .subtitle { gap: 8px; font-size: 12px; } .seller-name { font-size: 13px; } .price { font-size: 24px; } .manage-actions { grid-template-columns: 1fr; } .buyer-actions { gap: 6px; } }
@media (min-width: 768px) { .hero, .content-section, .footer { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>