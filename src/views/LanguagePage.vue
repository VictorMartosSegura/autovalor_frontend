<template>
  <ion-page>
    <ion-header class="ion-no-border mobile-safe-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/tabs/profile" text="" />
        </ion-buttons>
        <ion-title>{{ prefs.t('languageTitle') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page mobile-safe-content">
      <div class="wrap">
        <div class="intro-card">
          <ion-icon :icon="languageOutline" />
          <h1>{{ prefs.t('languageTitle') }}</h1>
          <p>{{ prefs.t('languageSubtitle') }}</p>
        </div>

        <button class="language-row" :class="{ active: prefs.language === 'en' }" @click="selectLanguage('en')">
          <div>
            <strong>{{ prefs.t('english') }}</strong>
            <p>{{ prefs.t('autoValorInEnglish') }}</p>
          </div>
          <ion-icon :icon="prefs.language === 'en' ? radioButtonOnOutline : radioButtonOffOutline" />
        </button>

        <button class="language-row" :class="{ active: prefs.language === 'es' }" @click="selectLanguage('es')">
          <div>
            <strong>{{ prefs.t('spanish') }}</strong>
            <p>{{ prefs.t('autoValorInSpanish') }}</p>
          </div>
          <ion-icon :icon="prefs.language === 'es' ? radioButtonOnOutline : radioButtonOffOutline" />
        </button>

        <p v-if="saved" class="saved-message">{{ prefs.t('saved') }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { languageOutline, radioButtonOffOutline, radioButtonOnOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore, type AppLanguage } from '@/stores/preferences';

const auth = useAuthStore();
const prefs = usePreferencesStore();
const saved = ref(false);

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
});

function selectLanguage(language: AppLanguage) {
  prefs.setLanguage(language);
  saved.value = true;
  window.setTimeout(() => {
    saved.value = false;
  }, 1400);
}
</script>

<style scoped>
.page { --background: #ffffff; }
.wrap { padding: 18px var(--app-page-gutter) 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.intro-card { background: #f7f7f8; border-radius: 24px; padding: 18px; margin-bottom: 18px; }
.intro-card ion-icon { width: 42px; height: 42px; padding: 10px; border-radius: 16px; background: #111216; color: #fff; margin-bottom: 12px; }
h1 { margin: 0 0 6px; color: #202127; font-size: 28px; line-height: 1.08; }
p { margin: 0; color: #70747c; font-size: 14px; line-height: 1.45; }
.language-row { width: 100%; border: 1px solid transparent; background: #f8f8f9; border-radius: 18px; padding: 16px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 14px; text-align: left; }
.language-row.active { border-color: #111216; background: #f3f3f4; }
.language-row strong { color: #202127; font-size: 16px; }
.language-row p { margin-top: 4px; font-size: 12px; }
.language-row ion-icon { color: #111216; font-size: 22px; }
.saved-message { margin-top: 8px; color: #027a48; font-weight: 800; }
@media (min-width: 768px) { .wrap { max-width: 760px; margin-left: auto; margin-right: auto; } }
</style>