<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/tabs/home" /></ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <section class="card">
        <h4>Shipping Address</h4>
        <div class="row" v-for="address in addresses" :key="address.id">
          <div>
            <strong>{{ address.name }}</strong>
            <p>{{ address.text }}</p>
          </div>
          <ion-radio :value="address.id" v-model="selectedAddress" />
        </div>
      </section>

         <section class="card">
        <h4>Choose Shipping</h4>
        <div class="row" v-for="ship in shippingMethods" :key="ship.id">
          <div>
            <strong>{{ ship.name }}</strong>
            <p>{{ ship.eta }}</p>
          </div>
          <div class="end">\${{ ship.price }}</div>
          <ion-radio :value="ship.id" v-model="selectedShipping" />
              </div>
            </section>

            <section class="card">
              <h4>Payment Methods</h4>
              <ion-radio-group v-model="payment">
                <ion-item lines="none" v-for="p in payments" :key="p.id">
                  <ion-label>{{ p.name }}</ion-label>
                  <ion-radio slot="end" :value="p.id" />
                </ion-item>
              </ion-radio-group>
            </section>

            <section class="card summary">
        <div><span>Amount</span><strong>\${{ amount }}</strong></div>
        <div><span>Shipping</span><strong>\${{ shippingCost }}</strong></div>
        <div><span>Tax</span><strong>\${{ tax }}</strong></div>
        <div class="total"><span>Total</span><strong>\${{ total }}</strong></div>
      </section>

            <ion-button expand="block" class="confirm" @click="confirmPayment">Confirm Payment</ion-button>

      <ion-alert
        :is-open="alertOpen"
        header="Order Successful!"
        message="Your purchase has been completed."
        :buttons="[{ text: 'Back to Home', 
                    handler: () => router.push('/tabs/home') 
        }]"
        @didDismiss="alertOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonAlert,
  IonRadio,
  IonItem,
  IonLabel,
  IonRadioGroup,
} from '@ionic/vue';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const payment = ref('wallet');
const alertOpen = ref(false);

const selectedAddress = ref('home');
const selectedShipping = ref('train');

const addresses = [
  { id: 'home', name: 'Home', text: '4180 Sunbrook Park, PC 5679' },
  { id: 'office', name: 'Office', text: '9993 Meadow Valley, PC 3637' },
];
const shippingMethods = [
  { id: 'truck', name: 'Truck', eta: 'Arrived Dec 20-23', price: 200 },
  { id: 'train', name: 'Train', eta: 'Arrived Dec 20-22', price: 250 },
  { id: 'ship', name: 'Container Ship', eta: 'Arrived Dec 21-29', price: 300 },
];
const payments = [
  { id: 'wallet', name: 'My Wallet' },
  { id: 'paypal', name: 'PayPal' },
  { id: 'gpay', name: 'Google Pay' },
  { id: 'apple', name: 'Apple Pay' },
];

const amount = 170000;
const tax = 1000;
const shippingCost = computed(() => shippingMethods.find((s) => s.id === selectedShipping.value)?.price ?? 0);
const total = computed(() => amount + tax + shippingCost.value);

function confirmPayment() {
  alertOpen.value = true;
}

</script>
<style scoped>
.card {
  border: 1px solid #efefef;
  border-radius: 14px;
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
}
h4 { margin: 2px 0 8px; font-size: 13px; font-weight: 800; }
.row {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  padding: 8px;
}
.row + .row { margin-top: 4px; }
.row strong { font-size: 12px; }
.row p { margin: 2px 0 0; font-size: 10px; color: #777; }
.end { margin-left: auto; font-size: 12px; font-weight: 700; }
.summary div { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
.total { border-top: 1px solid #eee; margin-top: 2px; padding-top: 8px !important; font-size: 14px !important; }
.confirm { --background: #0a0a0a; --border-radius: 14px; margin-top: 8px; }
</style>