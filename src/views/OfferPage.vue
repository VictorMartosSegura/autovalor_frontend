<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :default-href="`/car/${carId}`" />
        </ion-buttons>
        <ion-title>Make an Offer</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Your offer</ion-card-title>
          <ion-card-subtitle>Car: {{ carId }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-label position="stacked">Offer amount ($)</ion-label>
            <ion-input
              v-model="offer"
              inputmode="numeric"
              placeholder="e.g. 170000"
            />
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Message to seller (optional)</ion-label>
            <ion-textarea
              v-model="message"
              auto-grow
              placeholder="Write a short message..."
            />
          </ion-item>

          <ion-button expand="block" @click="submitOffer">
            Submit Offer
          </ion-button>

          <ion-button expand="block" fill="outline" @click="goCheckout">
            Proceed to Checkout
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-toast
        :is-open="toastOpen"
        message="Offer submitted successfully!"
        :duration="1500"
        @didDismiss="toastOpen = false"
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
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonToast,
} from '@ionic/vue';

import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const carId = String(route.params.id);

const offer = ref('');
const message = ref('');
const toastOpen = ref(false);

function submitOffer() {
  // Simulación (válida según enunciado si no hay backend)
  toastOpen.value = true;
}

function goCheckout() {
  router.push('/checkout');
}
</script>