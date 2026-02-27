<template>
  <ion-page>
    <div class="profileblank-container">
      <h2 class="profileblank-title">Fill Your Profile</h2>
      <ion-input placeholder="Full Name" class="profileblank-input" />
      <ion-input placeholder="Username" class="profileblank-input" />
      <ion-input placeholder="Email" class="profileblank-input" />
      <ion-input placeholder="Phone" class="profileblank-input" />
      <ion-input placeholder="Gender" class="profileblank-input" />
      <ion-button expand="block" class="profileblank-btn" @click="goToCreatePassword">Continue</ion-button>
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonInput, IonButton } from '@ionic/vue';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToCreatePassword() {
  router.push('/createnewpassword');
}
</script>

<style scoped>
.profileblank-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fff;
}
.profileblank-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}
.profileblank-input {
  margin-bottom: 12px;
  width: 220px;
}
.profileblank-btn {
  margin-top: 16px;
  width: 220px;
}
</style>