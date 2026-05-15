<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/payment-methods" text="" /></ion-buttons>
        <ion-title>Review Summary</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content" v-if="car">
      <div class="wrap">
        <div class="box order-box">
          <img :src="image" :alt="car.title" />
          <div><strong>{{ car.title }}</strong><p>{{ car.color || 'Color' }}</p></div>
        </div>

        <div class="box summary">
          <div><span>Amount</span><strong>{{ money(amount) }}</strong></div>
          <div><span>Shipping</span><strong>{{ money(shipping.price) }}</strong></div>
          <div><span>Tax</span><strong>{{ money(tax) }}</strong></div>
          <div class="total"><span>Total</span><strong>{{ money(total) }}</strong></div>
        </div>

        <div class="box"><div><strong>{{ address.name }}</strong><p>{{ address.text }}</p></div><ion-icon :icon="createOutline" /></div>
        <div class="box"><strong>{{ paymentName }}</strong><button class="change" @click="goPayment">Change</button></div>
      </div>
    </ion-content>

    <ion-content v-else class="page mobile-safe-content"><div class="wrap empty">Loading summary...</div></ion-content>

    <ion-footer class="ion-no-border footer" v-if="car">
      <ion-button expand="block" class="primary" @click="confirmPayment">Confirm Payment</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createOutline } from 'ionicons/icons';
import { listingService, normalizeImageUrl, type ListingResponse } from '@/services/listingService';
import logo from '@/assets/logos/autovalor_logo.png';

const route = useRoute();
const router = useRouter();
const ADDRESSES = {
  home: { id: 'home', name: 'Home', text: '6480 Sunbrook Park, PC 5679' },
  office: { id: 'office', name: 'Office', text: '6993 Meadow Valley Terra, PC 3637' },
  apartment: { id: 'apartment', name: 'Apartment', text: '21833 Clyde Gallagher, PC 4662' },
  parents: { id: 'parents', name: "Parent's House", text: '5259 Blue Bill Park, PC 4627' },
} as const;
const SHIPPING = {
  truck: { id: 'truck', name: 'Truck', price: 200 },
  train: { id: 'train', name: 'Train', price: 250 },
  ship: { id: 'ship', name: 'Container Ship', price: 300 },
  plane: { id: 'plane', name: 'Plane', price: 400 },
} as const;
const PAYMENTS = { wallet: 'My Wallet', paypal: 'PayPal', gpay: 'Google Pay', apple: 'Apple Pay', card: '.... .... .... 4679' } as const;
const carId = computed(() => String(route.query.car || ''));
const addressId = computed(() => String(route.query.address ?? 'home') as keyof typeof ADDRESSES);
const shippingId = computed(() => String(route.query.shipping ?? 'train') as keyof typeof SHIPPING);
const paymentId = computed(() => String(route.query.payment ?? 'wallet') as keyof typeof PAYMENTS);
const car = ref<(ListingResponse & { title: string }) | null>(null);
const image = ref(logo);
const address = computed(() => ADDRESSES[addressId.value] ?? ADDRESSES.home);
const shipping = computed(() => SHIPPING[shippingId.value] ?? SHIPPING.train);
const paymentName = computed(() => PAYMENTS[paymentId.value] ?? PAYMENTS.wallet);
const amount = computed(() => Number(route.query.price || car.value?.price || 0));
const tax = 1000;
const total = computed(() => amount.value + shipping.value.price + tax);

onMounted(loadCar);
async function loadCar() {
  if (!carId.value) return;
  const listing = await listingService.getById(carId.value, null).catch(() => null);
  if (!listing) return;
  const images = await listingService.getImages(carId.value).catch(() => []);
  car.value = { ...listing, title: listing.title || `${listing.brand} ${listing.model}` };
  image.value = normalizeImageUrl(images?.[0]?.url) || logo;
}
function money(n: number) { return `${Number(n || 0).toLocaleString('es-ES')} €`; }
function goPayment() { router.push({ path: '/payment-methods', query: route.query }); }
function confirmPayment() { router.push({ path: '/order-success', query: route.query }); }
</script>

<style scoped>
.page { --background: #fff; }
.wrap { padding: 12px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.empty { color: #7b7f86; text-align: center; padding-top: 80px; }
.box { background: #f8f8f9; border-radius: 16px; padding: 14px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
.order-box { justify-content: flex-start; gap: 10px; }
.order-box img { width: 84px; height: 58px; object-fit: contain; background: #efeff0; border-radius: 10px; padding: 4px; }
strong { font-size: 15px; color: #202127; }
p { margin: 4px 0 0; color: #7b7f86; font-size: 12px; }
.summary { display: block; }
.summary div { display: flex; justify-content: space-between; padding: 8px 0; color: #51545d; font-size: 14px; }
.summary .total { border-top: 1px solid #ececee; margin-top: 4px; padding-top: 12px; color: #1f222a; font-weight: 700; }
.change { border: 0; background: transparent; color: #202127; font-weight: 700; }
.footer { padding: 12px var(--app-page-gutter) 20px; }
.primary { --background: #07080d; --border-radius: 999px; height: 52px; text-transform: none; font-weight: 600; }
@media (max-width: 360px) { strong { font-size: 14px; } .summary div { font-size: 13px; } }
@media (min-width: 768px) { .wrap, .footer { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>
