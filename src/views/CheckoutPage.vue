<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/tabs/home" text="" /></ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="checkout-page" v-if="car">
      <div class="wrap">
        <h3>Shipping Address</h3>
        <button class="box" @click="goAddress">
          <div>
            <strong>{{ address.name }}</strong>
            <p>{{ address.text }}</p>
          </div>
          <ion-icon :icon="createOutline" />
        </button>

        <h3>Order</h3>
        <div class="box order-box">
          <img :src="car.images[0]" :alt="car.brand" />
          <div>
            <strong>{{ car.brand }} {{ car.model }}</strong>
            <p>Silver</p>
            <div class="price">{{ money(amount) }}</div>
          </div>
        </div>

        <h3>Choose Shipping</h3>
        <button class="box" @click="goShipping">
          <div>
            <strong>{{ shipping.name }}</strong>
            <p>{{ shipping.eta }}</p>
          </div>
          <div class="ship-end">
            <strong>{{ money(shipping.price) }}</strong>
            <ion-icon :icon="createOutline" />
          </div>
        </button>

        <div class="box summary">
          <div><span>Amount</span><strong>{{ money(amount) }}</strong></div>
          <div><span>Shipping</span><strong>{{ money(shipping.price) }}</strong></div>
          <div><span>Tax</span><strong>{{ money(tax) }}</strong></div>
          <div class="total"><span>Total</span><strong>{{ money(total) }}</strong></div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer" v-if="car">
      <ion-button expand="block" class="primary" @click="goPayment">Continue to Payment</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { createOutline } from 'ionicons/icons';
import { CARS } from '@/data/cars';

const ADDRESSES = {
  home: { id: 'home', name: 'Home', text: '6480 Sunbrook Park, PC 5679' },
  office: { id: 'office', name: 'Office', text: '6993 Meadow Valley Terra, PC 3637' },
  apartment: { id: 'apartment', name: 'Apartment', text: '21833 Clyde Gallagher, PC 4662' },
  parents: { id: 'parents', name: "Parent's House", text: '5259 Blue Bill Park, PC 4627' },
} as const;

const SHIPPING = {
  truck: { id: 'truck', name: 'Truck', eta: 'Est. Arrival, Dec 20-23', price: 200 },
  train: { id: 'train', name: 'Train', eta: 'Est. Arrival, Dec 20-22', price: 250 },
  ship: { id: 'ship', name: 'Container Ship', eta: 'Est. Arrival, Dec 19-20', price: 300 },
  plane: { id: 'plane', name: 'Plane', eta: 'Est. Arrival, Dec 18-19', price: 400 },
} as const;

const route = useRoute();
const router = useRouter();

const carId = computed(() => String(route.query.car ?? 'bmw-m5'));
const addressId = computed(() => String(route.query.address ?? 'home') as keyof typeof ADDRESSES);
const shippingId = computed(() => String(route.query.shipping ?? 'train') as keyof typeof SHIPPING);

const car = computed(() => CARS.find((c) => c.id === carId.value));
const address = computed(() => ADDRESSES[addressId.value] ?? ADDRESSES.home);
const shipping = computed(() => SHIPPING[shippingId.value] ?? SHIPPING.train);

const amount = computed(() => car.value?.price ?? 170000);
const tax = 1000;
const total = computed(() => amount.value + shipping.value.price + tax);

function money(n: number) { return `$${n.toLocaleString('en-US')}`; }

function goAddress() {
  router.push({ path: '/shipping-address', query: { car: carId.value, shipping: shippingId.value, address: addressId.value } });
}
function goShipping() {
  router.push({ path: '/choose-shipping', query: { car: carId.value, shipping: shippingId.value, address: addressId.value } });
}
function goPayment() {
  router.push({ path: '/payment-methods', query: { car: carId.value, shipping: shippingId.value, address: addressId.value } });
}
</script>

<style scoped>
.checkout-page { --background: #fff; }
.wrap { padding: 12px 16px 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
h3 { margin: 10px 0; color: #23242b; font-size: 15px; }
.box {
  width: 100%; border: 0; text-align: left; background: #f8f8f9; border-radius: 16px;
  padding: 14px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.box strong { color: #202127; font-size: 15px; }
.box p { margin: 4px 0 0; color: #7a7d85; font-size: 12px; }
.order-box img { width: 82px; height: 58px; object-fit: contain; background: #efeff0; border-radius: 10px; padding: 4px; }
.price { margin-top: 6px; font-size: 26px; font-weight: 700; color: #1f222a; }
.ship-end { display: flex; align-items: center; gap: 10px; }
.summary { display: block; }
.summary div { display: flex; justify-content: space-between; padding: 8px 0; color: #51545d; font-size: 14px; }
.summary .total { border-top: 1px solid #ececee; margin-top: 4px; padding-top: 12px; color: #1f222a; font-weight: 700; }
.footer { padding: 12px 16px 20px; background: #fff; }
.primary { --background: #33353b; --color: #fff; --border-radius: 12px; height: 50px; text-transform: none; font-weight: 600; }
</style>
