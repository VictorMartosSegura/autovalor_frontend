<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/profile" text="" />
        </ion-buttons>
        <ion-title>{{ prefs.t('addressTitle') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content">
      <div class="wrap">
        <div class="intro-card">
          <ion-icon :icon="locationOutline" />
          <h1>{{ prefs.t('addressTitle') }}</h1>
          <p>{{ prefs.t('addressSubtitle') }}</p>
        </div>

        <label class="field">
          <span>{{ prefs.t('country') }}</span>
          <input v-model="country" type="text" :placeholder="prefs.t('countryPlaceholder')" />
        </label>

        <label class="field">
          <span>{{ prefs.t('city') }}</span>
          <input v-model="city" type="text" :placeholder="prefs.t('cityPlaceholder')" />
        </label>

        <label class="field">
          <span>{{ prefs.t('streetAddress') }}</span>
          <textarea v-model="address" rows="4" :placeholder="prefs.t('addressPlaceholder')"></textarea>
        </label>

        <p v-if="savedMessage" class="saved-message">{{ savedMessage }}</p>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="saveAddress">
        {{ prefs.t('saveAddress') }}
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { locationOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const auth = useAuthStore();
const prefs = usePreferencesStore();
const country = ref('');
const city = ref('');
const address = ref('');
const savedMessage = ref('');

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  country.value = prefs.address.country;
  city.value = prefs.address.city;
  address.value = prefs.address.address;
});

function saveAddress() {
  prefs.setAddress(auth.user?.id, {
    country: country.value.trim(),
    city: city.value.trim(),
    address: address.value.trim(),
  });
  savedMessage.value = prefs.t('addressSaved');
  window.setTimeout(() => {
    savedMessage.value = '';
  }, 1800);
}
</script>

<style scoped>
.page { --background: #ffffff; }
.wrap { padding: 18px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.intro-card { background: #f7f7f8; border-radius: 24px; padding: 18px; margin-bottom: 18px; }
.intro-card ion-icon { width: 42px; height: 42px; padding: 10px; border-radius: 16px; background: #111216; color: #fff; margin-bottom: 12px; }
h1 { margin: 0 0 6px; color: #202127; font-size: 28px; line-height: 1.08; }
p { margin: 0; color: #70747c; font-size: 14px; line-height: 1.45; }
.field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
.field span { font-size: 13px; color: #5d626c; font-weight: 800; }
.field input, .field textarea { width: 100%; border: 1px solid #e1e3e7; border-radius: 16px; background: #f8f8f9; padding: 13px 14px; outline: none; color: #202127; font: inherit; }
.field textarea { resize: vertical; min-height: 104px; }
.saved-message { margin: 4px 0 0; color: #027a48; font-weight: 700; }
.footer { background: #fff; padding: 12px var(--app-page-gutter) 20px; }
.primary { --background: #111216; --color: #fff; --border-radius: 999px; height: 54px; text-transform: none; font-weight: 800; }
@media (min-width: 768px) { .wrap, .footer { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>
