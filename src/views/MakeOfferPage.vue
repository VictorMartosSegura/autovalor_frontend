<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar class="offer-toolbar">
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/car/${carId}`" text="" />
        </ion-buttons>
        <ion-title>Make offer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content">
      <div v-if="loading" class="state-block">
        <ion-spinner name="crescent" />
        <p>Loading vehicle...</p>
      </div>

      <div v-else-if="errorMessage" class="state-block">
        <p>{{ errorMessage }}</p>
        <ion-button size="small" @click="loadCar">Retry</ion-button>
      </div>

      <div v-else-if="car" class="wrap">
        <div class="vehicle-card">
          <img :src="image" :alt="carTitle" />
          <div class="vehicle-info">
            <h1>{{ carTitle }}</h1>
            <p>{{ car.year || 'Vehicle' }} · {{ car.km ? `${formatKm(car.km)} km` : 'Mileage not specified' }}</p>
            <strong>{{ formatPrice(car.price) }} €</strong>
          </div>
        </div>

        <section class="offer-card">
          <p class="eyebrow">Your offer</p>
          <h2>Send a private offer to the seller</h2>
          <p class="helper">The seller will receive your offer in the chat and can accept or reject it.</p>

          <label class="amount-field">
            <span>Offer amount</span>
            <div class="amount-input">
              <input v-model="amountText" inputmode="numeric" type="text" placeholder="0" @input="cleanAmount" />
              <strong>€</strong>
            </div>
          </label>

          <div class="quick-row">
            <button type="button" @click="setPercentage(0.9)">90%</button>
            <button type="button" @click="setPercentage(0.95)">95%</button>
            <button type="button" @click="setPercentage(1)">Full price</button>
          </div>

          <div class="summary-row">
            <span>Asking price</span>
            <strong>{{ formatPrice(car.price) }} €</strong>
          </div>
          <div class="summary-row">
            <span>Your offer</span>
            <strong>{{ formatPrice(amount) }} €</strong>
          </div>

          <p v-if="validationMessage" class="validation">{{ validationMessage }}</p>
        </section>
      </div>
    </ion-content>

    <ion-footer v-if="car" class="ion-no-border footer">
      <ion-button expand="block" class="primary" :disabled="sending || !canSend" @click="sendOffer">
        <ion-spinner v-if="sending" name="crescent" />
        <span v-else>Send offer</span>
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonPage, IonSpinner, IonTitle, IonToolbar } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { chatService } from '@/services/chatService';
import { createOfferMessage } from '@/services/demoOfferService';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';
import logo from '@/assets/logos/autovalor_logo.png';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const carId = String(route.params.id);
const car = ref<ListingResponse | null>(null);
const image = ref(logo);
const amountText = ref('');
const loading = ref(false);
const sending = ref(false);
const errorMessage = ref('');

const carTitle = computed(() => car.value?.title || `${car.value?.brand || ''} ${car.value?.model || ''}`.trim() || 'Vehicle');
const amount = computed(() => Number(amountText.value.replace(/[^0-9]/g, '')) || 0);
const canSend = computed(() => amount.value > 0 && amount.value <= 999999999);
const validationMessage = computed(() => {
  if (!amountText.value) return '';
  if (amount.value <= 0) return 'Enter a valid amount.';
  if (car.value?.price && amount.value < Number(car.value.price) * 0.5) return 'This offer is much lower than the asking price.';
  return '';
});

onMounted(async () => {
  await auth.init();
  if (!auth.token) {
    router.replace({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }
  await loadCar();
});

async function loadCar() {
  loading.value = true;
  errorMessage.value = '';
  try {
    const listing = await listingService.getById(carId, auth.token);
    const images = await listingService.getImages(carId).catch(() => []);
    car.value = listing;
    image.value = normalizeImageUrl(images?.[0]?.url) || normalizeImageUrl(listing.images?.[0]?.url) || logo;
    amountText.value = String(Math.round(Number(listing.price || 0) * 0.95));
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load the vehicle.';
  } finally {
    loading.value = false;
  }
}

function cleanAmount() {
  amountText.value = amountText.value.replace(/[^0-9]/g, '');
}

function setPercentage(percent: number) {
  if (!car.value) return;
  amountText.value = String(Math.round(Number(car.value.price || 0) * percent));
}

async function sendOffer() {
  await auth.init();
  if (!auth.token) {
    router.replace({ path: '/signin', query: { redirect: route.fullPath } });
    return;
  }
  if (!car.value || !canSend.value || sending.value) return;

  sending.value = true;
  errorMessage.value = '';
  try {
    const conversation = await chatService.startForListing(car.value.id, auth.token);
    const content = createOfferMessage({
      offerId: `offer-${Date.now()}`,
      listingId: car.value.id,
      listingTitle: carTitle.value,
      amount: amount.value,
      buyerId: auth.user?.id,
      buyerName: auth.user?.name,
    });
    await chatService.sendMessage(conversation.id, content, auth.token);
    router.replace(`/chat/${conversation.id}`);
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not send the offer.';
  } finally {
    sending.value = false;
  }
}

function formatPrice(value?: number) {
  return Number(value || 0).toLocaleString('es-ES');
}

function formatKm(value?: number) {
  return Number(value || 0).toLocaleString('es-ES');
}
</script>

<style scoped>
.offer-toolbar {
  --background: #fff;
  --padding-top: var(--app-safe-top);
}
.offer-toolbar ion-title {
  font-size: 17px;
  font-weight: 800;
  color: #202127;
}
.page {
  --background: #ffffff;
}
.wrap {
  padding: 18px var(--app-page-gutter) 24px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}
.state-block {
  min-height: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #71757d;
  text-align: center;
}
.vehicle-card {
  background: #f7f7f8;
  border-radius: 22px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 18px;
}
.vehicle-card img {
  width: 112px;
  height: 86px;
  object-fit: contain;
  border-radius: 16px;
  background: #eeeeef;
  padding: 6px;
}
.vehicle-info {
  min-width: 0;
  flex: 1;
}
.vehicle-info h1 {
  margin: 0;
  font-size: 20px;
  line-height: 1.05;
  color: #202127;
}
.vehicle-info p {
  margin: 7px 0;
  color: #858993;
  font-size: 12px;
}
.vehicle-info strong {
  color: #111216;
  font-size: 18px;
}
.offer-card {
  background: #f7f7f8;
  border-radius: 24px;
  padding: 18px;
}
.eyebrow {
  margin: 0 0 5px;
  font-size: 12px;
  color: #7c8088;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .04em;
}
h2 {
  margin: 0;
  color: #202127;
  font-size: 26px;
  line-height: 1.08;
  letter-spacing: -0.03em;
}
.helper {
  margin: 10px 0 18px;
  color: #70747c;
  font-size: 14px;
  line-height: 1.45;
}
.amount-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}
.amount-field span {
  color: #5d626c;
  font-weight: 800;
  font-size: 13px;
}
.amount-input {
  height: 62px;
  border-radius: 18px;
  background: #fff;
  border: 1px solid #e1e3e7;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
}
.amount-input input {
  flex: 1;
  border: 0;
  outline: none;
  background: transparent;
  color: #111216;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: -0.04em;
  min-width: 0;
}
.amount-input strong {
  font-size: 24px;
  color: #111216;
}
.quick-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}
.quick-row button {
  min-height: 38px;
  border: 0;
  border-radius: 999px;
  background: #fff;
  color: #202127;
  font-weight: 800;
}
.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-top: 1px solid #e8e9ed;
  color: #6b7079;
  font-size: 14px;
}
.summary-row strong {
  color: #202127;
}
.validation {
  margin: 10px 0 0;
  color: #b45309;
  font-size: 13px;
}
.footer {
  padding: 12px var(--app-page-gutter) 20px;
  background: #fff;
}
.primary {
  --background: #111216;
  --color: #fff;
  --border-radius: 999px;
  height: 54px;
  text-transform: none;
  font-weight: 800;
}
.primary:disabled {
  opacity: .55;
}
@media (max-width: 360px) {
  .vehicle-card img {
    width: 92px;
    height: 72px;
  }
  .vehicle-info h1 {
    font-size: 18px;
  }
  h2 {
    font-size: 23px;
  }
  .amount-input input {
    font-size: 26px;
  }
}
@media (min-width: 768px) {
  .wrap,
  .footer {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
