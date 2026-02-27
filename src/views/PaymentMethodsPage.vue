<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/checkout" text="" /></ion-buttons>
        <ion-title>Payment Methods</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content">
      <div class="wrap">
        <p class="desc">Select the payment method you want to use.</p>

        <button v-for="item in methods" :key="item.id" class="row" @click="selected = item.id">
          <span class="row-left">
            <img class="method-logo" :src="item.icon" :alt="item.name" />
            <strong>{{ item.name }}</strong>
          </span>
          <ion-icon :icon="selected === item.id ? radioButtonOnOutline : radioButtonOffOutline" />
        </button>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="continueToReview">Continue</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { radioButtonOffOutline, radioButtonOnOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import walletLogo from '@/assets/logos/wallet.png';
import paypalLogo from '@/assets/logos/paypal.png';
import googleLogo from '@/assets/logos/google.png';
import appleLogo from '@/assets/logos/apple.png';
import mastercardLogo from '@/assets/logos/mastercard.png';

const route = useRoute();
const router = useRouter();
const selected = ref(String(route.query.payment ?? 'wallet'));

const methods = [
  { id: 'wallet', name: 'My Wallet', icon: walletLogo },
  { id: 'paypal', name: 'PayPal', icon: paypalLogo },
  { id: 'gpay', name: 'Google Pay', icon: googleLogo },
  { id: 'apple', name: 'Apple Pay', icon: appleLogo },
  { id: 'card', name: '.... .... .... 4679', icon: mastercardLogo },
];

function continueToReview() {
  router.push({ path: '/review-summary', query: { car: String(route.query.car ?? 'bmw-m5'), shipping: String(route.query.shipping ?? 'train'), address: String(route.query.address ?? 'home'), payment: selected.value } });
}
</script>

<style scoped>
.page { --background: #fff; }
.wrap { padding: 12px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.desc { margin: 0 0 12px; color: #6b6f76; font-size: 14px; }
.row { width: 100%; background: #f8f8f9; border: 0; border-radius: 16px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
.row-left { display: flex; align-items: center; gap: 10px; }
.method-logo { width: 22px; height: 22px; object-fit: contain; }
strong { font-size: 15px; color: #202127; }
.footer { padding: 12px var(--app-page-gutter) 20px; }
.primary { --background: #07080d; --border-radius: 999px; height: 52px; text-transform: none; font-weight: 600; }

@media (max-width: 360px) {
  .row {
    padding: 14px;
  }

  strong {
    font-size: 14px;
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
