<template>
  <ion-page>
    <ion-content class="success-page">
      <div class="success-wrap">
        <img class="success-icon" :src="orderSuccessImg" alt="Order success" />
        <h2>Order Successful!</h2>
        <p>You have successfully made order</p>

        <ion-button expand="block" class="primary" @click="viewOrder">View Order</ion-button>
        <ion-button expand="block" class="secondary" @click="viewReceipt">View E-Receipt</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonPage } from '@ionic/vue';
import { useRouter } from 'vue-router';
import orderSuccessImg from '@/assets/images/order_succes.png';

const router = useRouter();

function viewOrder() {
  window.sessionStorage.setItem('orders_default_segment', 'active');
  router.replace('/tabs/orders');
}

function viewReceipt() {
  router.replace('/tabs/orders');
}
</script>

<style scoped>
.success-page { --background: #fff; }
.success-wrap {
  min-height: 100%;
  padding: 24px var(--app-page-gutter);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}
.success-icon {
  width: 160px;
  height: 160px;
  object-fit: contain;
  margin-bottom: 14px;
}
h2 { margin: 0 0 8px; color: #202127; font-size: clamp(28px, 9vw, 36px); }
p { margin: 0 0 20px; color: #70737b; font-size: clamp(16px, 5.5vw, 20px); }
.primary {
  --background: #07080d;
  --color: #fff;
  --border-radius: 999px;
  height: 52px;
  text-transform: none;
  font-weight: 600;
  margin-bottom: 10px;
  width: 100%;
  max-width: 320px;
}
.secondary {
  --background: #efeff1;
  --color: #202127;
  --border-radius: 999px;
  height: 52px;
  text-transform: none;
  font-weight: 600;
  width: 100%;
  max-width: 320px;
}

@media (max-width: 360px) {
  .success-icon {
    width: 136px;
    height: 136px;
  }
}
</style>
