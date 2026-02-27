<template>
  <ion-page>
    <ion-content class="success-page">
      <div class="success-wrap">
        <div class="success-icon">??</div>
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

const router = useRouter();

function viewOrder() {
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
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}
.success-icon {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 20%, #2e3036 0, #101116 70%);
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 46px;
  margin-bottom: 14px;
}
h2 { margin: 0 0 8px; color: #202127; font-size: 36px; }
p { margin: 0 0 20px; color: #70737b; font-size: 20px; }
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
</style>
