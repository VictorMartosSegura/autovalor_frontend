<template>
  <ion-page>
    <div class="splash-container">
      <img src="/src/assets/logos/autovalor_logo.png" alt="AutoValor Logo" class="splash-logo" />
      <h1 class="splash-title">AutoValor</h1>
      <ion-spinner name="dots" class="splash-spinner" />
    </div>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonSpinner } from '@ionic/vue';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    router.replace('/letsyouin');
  }, 5000); // 5 segundos
});
</script>

<style scoped>
.splash-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #fff;
}
.splash-logo {
  width: 120px;
  margin-bottom: 24px;
}
.splash-title {
  font-size: 32px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 32px;
}
.splash-spinner {
  margin-top: 16px;
}
</style>
