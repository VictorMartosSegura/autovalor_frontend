<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/profile" text="" />
        </ion-buttons>
        <ion-title>{{ prefs.t('addressTitle') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content">
      <div class="wrap">
        <div class="intro-card">
          <ion-icon :icon="locationOutline" />
          <h1>{{ prefs.t('addressTitle') }}</h1>
          <p>{{ prefs.t('addressSubtitle') }}</p>
        </div>

        <label class="field">
          <span>{{ prefs.t('country') }}</span>
          <input v-model="country" type="text" :placeholder="prefs.t('countryPlaceholder')" />
        </label>

        <label class="field">
          <span>{{ prefs.t('city') }}</span>
          <input v-model="city" type="text" :placeholder="prefs.t('cityPlaceholder')" />
        </label>

        <label class="field">
          <span>{{ prefs.t('streetAddress') }}</span>
          <textarea v-model="address" rows="4" :placeholder="prefs.t('addressPlaceholder')"></textarea>
        </label>

        <div class="map-preview">
          <div ref="mapEl" class="map-box"></div>
          <p>{{ city || prefs.t('cityPlaceholder') }}, {{ country || prefs.t('countryPlaceholder') }}</p>
        </div>

        <p v-if="savedMessage" class="saved-message">{{ savedMessage }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" :disabled="saving" @click="saveAddress">
        <ion-spinner v-if="saving" name="crescent" />
        <span v-else>{{ prefs.t('saveAddress') }}</span>
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';
import maplibregl, { type Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const auth = useAuthStore();
const prefs = usePreferencesStore();
const country = ref('');
const city = ref('');
const address = ref('');
const savedMessage = ref('');
const errorMessage = ref('');
const saving = ref(false);
const mapEl = ref<HTMLElement | null>(null);
let map: MapLibreMap | null = null;
let marker: maplibregl.Marker | null = null;

const cityCoords: Record<string, [number, number]> = {
  barcelona: [2.1734, 41.3851],
  madrid: [-3.7038, 40.4168],
  valencia: [-0.3763, 39.4699],
  sevilla: [-5.9845, 37.3891],
  zaragoza: [-0.8891, 41.6488],
  malaga: [-4.4214, 36.7213],
  murcia: [-1.1307, 37.9922],
  palma: [2.6502, 39.5696],
  bilbao: [-2.935, 43.263],
  alicante: [-0.4907, 38.3452],
  girona: [2.8214, 41.9794],
  tarragona: [1.2445, 41.1189],
  lleida: [0.6200, 41.6176],
};

onMounted(async () => {
  await auth.init();
  await auth.refreshMe();
  prefs.init(auth.user?.id);
  country.value = auth.user?.addressCountry || prefs.address.country || '';
  city.value = auth.user?.addressCity || prefs.address.city || '';
  address.value = auth.user?.addressLine || prefs.address.address || '';
  await nextTick();
  initMap();
});

onBeforeUnmount(() => {
  map?.remove();
  map = null;
});

watch([city, country], () => updateMap(), { flush: 'post' });

function getCoordinates(): [number, number] {
  const key = city.value.trim().toLowerCase();
  return cityCoords[key] || [-3.7038, 40.4168];
}

function initMap() {
  if (!mapEl.value || map) return;
  const coords = getCoordinates();
  map = new maplibregl.Map({
    container: mapEl.value,
    style: 'https://demotiles.maplibre.org/style.json',
    center: coords,
    zoom: city.value ? 10 : 5,
    attributionControl: false,
  });
  marker = new maplibregl.Marker({ color: '#111216' }).setLngLat(coords).addTo(map);
  map.on('load', () => map?.resize());
}

function updateMap() {
  const coords = getCoordinates();
  marker?.setLngLat(coords);
  map?.flyTo({ center: coords, zoom: city.value ? 10 : 5, essential: true });
}

async function saveAddress() {
  await auth.init();
  if (!auth.token) return;
  saving.value = true;
  errorMessage.value = '';
  savedMessage.value = '';

  const coords = getCoordinates();
  try {
    const saved = await auth.updateAddress({
      country: country.value.trim(),
      city: city.value.trim(),
      address: address.value.trim(),
      latitude: coords[1],
      longitude: coords[0],
    });
    prefs.setAddress(auth.user?.id, {
      country: saved.country || '',
      city: saved.city || '',
      address: saved.address || '',
    });
    savedMessage.value = prefs.t('addressSaved');
    updateMap();
    window.setTimeout(() => { savedMessage.value = ''; }, 1800);
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not save the address.';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.page { --background: #ffffff; }
.wrap { padding: 18px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.intro-card { background: #f7f7f8; border-radius: 24px; padding: 18px; margin-bottom: 18px; }
.intro-card ion-icon { width: 42px; height: 42px; padding: 10px; border-radius: 16px; background: #111216; color: #fff; margin-bottom: 12px; }
h1 { margin: 0 0 6px; color: #202127; font-size: 28px; line-height: 1.08; }
p { margin: 0; color: #70747c; font-size: 14px; line-height: 1.45; }
.field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
.field span { font-size: 13px; color: #5d626c; font-weight: 800; }
.field input, .field textarea { width: 100%; border: 1px solid #e1e3e7; border-radius: 16px; background: #f8f8f9; padding: 13px 14px; outline: none; color: #202127; font: inherit; }
.field textarea { resize: vertical; min-height: 104px; }
.map-preview { background: #f7f7f8; border-radius: 18px; padding: 10px; margin-bottom: 12px; }
.map-box { width: 100%; height: 160px; border-radius: 14px; overflow: hidden; background: #eceef1; }
.map-preview p { margin-top: 8px; font-weight: 700; color: #202127; }
.saved-message { margin: 4px 0 0; color: #027a48; font-weight: 700; }
.error-message { margin: 4px 0 0; color: #d92d20; font-weight: 700; }
.footer { background: #fff; padding: 12px var(--app-page-gutter) 20px; }
.primary { --background: #111216; --color: #fff; --border-radius: 999px; height: 54px; text-transform: none; font-weight: 800; }
@media (min-width: 768px) { .wrap, .footer { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>
