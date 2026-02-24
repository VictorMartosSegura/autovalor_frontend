<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/home" />
        </ion-buttons>
        <ion-title>Checkout</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Payment</ion-card-title>
          <ion-card-subtitle>Select payment method</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-radio-group v-model="payment">
            <ion-item>
              <ion-label>My Wallet</ion-label>
              <ion-radio value="wallet" slot="start" />
            </ion-item>

            <ion-item>
              <ion-label>PayPal</ion-label>
              <ion-radio value="paypal" slot="start" />
            </ion-item>

            <ion-item>
              <ion-label>Google Pay</ion-label>
              <ion-radio value="gpay" slot="start" />
            </ion-item>

            <ion-item>
              <ion-label>Apple Pay</ion-label>
              <ion-radio value="apple" slot="start" />
            </ion-item>
          </ion-radio-group>

          <ion-button expand="block" @click="confirmPayment">
            Confirm Payment
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-alert
        :is-open="alertOpen"
        header="Order Successful!"
        message="Your purchase has been completed."
        :buttons="[
          {
            text: 'Back to Home',
            handler: () => router.push('/tabs/home'),
          },
        ]"
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
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonRadioGroup,
  IonRadio,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert,
} from '@ionic/vue';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const payment = ref('wallet');
const alertOpen = ref(false);

function confirmPayment() {
  alertOpen.value = true;
}
</script>