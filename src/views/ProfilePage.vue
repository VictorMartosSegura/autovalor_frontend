<template>
  <ion-page>
    <ion-header class="ion-no-border profile-header">
      <ion-toolbar>
        <div class="head-row">
          <div class="title-row">
            <img :src="logo" alt="AutoValor" class="logo" />
            <h1>{{ prefs.t('profileTitle') }}</h1>
          </div>
          <ion-button fill="clear" size="small" class="menu-btn" @click="refreshProfile">
            <ion-icon :icon="ellipsisHorizontal" />
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <div class="wrap">
        <div class="avatar-wrap">
          <div class="avatar fallback-avatar">{{ initials }}</div>
          <button class="edit-avatar" @click="goEdit">
            <ion-icon :icon="create" />
          </button>
        </div>

        <h2>{{ userName }}</h2>
        <p class="phone">{{ userEmail }}</p>
        <p v-if="addressPreview" class="address-preview">{{ addressPreview }}</p>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="menu-list">
          <button class="row" @click="goEdit"><ion-icon :icon="personOutline" /><span>{{ prefs.t('editProfile') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="goListings"><ion-icon :icon="carSportOutline" /><span>{{ prefs.t('listings') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="goAddress"><ion-icon :icon="locationOutline" /><span>{{ prefs.t('address') }}</span><span v-if="shortAddress" class="value">{{ shortAddress }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('notification'))"><ion-icon :icon="notificationsOutline" /><span>{{ prefs.t('notification') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('payment'))"><ion-icon :icon="cardOutline" /><span>{{ prefs.t('payment') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('security'))"><ion-icon :icon="shieldCheckmarkOutline" /><span>{{ prefs.t('security') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="goLanguage"><ion-icon :icon="languageOutline" /><span>{{ prefs.t('language') }}</span><span class="value">{{ prefs.languageLabel }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('darkMode'))"><ion-icon :icon="moonOutline" /><span>{{ prefs.t('darkMode') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('privacyPolicy'))"><ion-icon :icon="documentTextOutline" /><span>{{ prefs.t('privacyPolicy') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('helpCenter'))"><ion-icon :icon="helpCircleOutline" /><span>{{ prefs.t('helpCenter') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon(prefs.t('inviteFriends'))"><ion-icon :icon="peopleOutline" /><span>{{ prefs.t('inviteFriends') }}</span><ion-icon :icon="chevronForward" /></button>
          <button class="row logout" :disabled="loggingOut" @click="logout"><ion-icon :icon="logOutOutline" /><span>{{ loggingOut ? prefs.t('loggingOut') : prefs.t('logout') }}</span></button>
        </div>
      </div>

      <ion-alert
        :is-open="maintenanceOpen"
        :header="prefs.t('maintenanceTitle')"
        :message="maintenanceMessage"
        :buttons="[prefs.t('understood')]"
        css-class="maintenance-alert"
        @didDismiss="maintenanceOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonAlert } from '@ionic/vue';
import {
  cardOutline,
  carSportOutline,
  chevronForward,
  create,
  documentTextOutline,
  ellipsisHorizontal,
  helpCircleOutline,
  languageOutline,
  locationOutline,
  logOutOutline,
  moonOutline,
  notificationsOutline,
  peopleOutline,
  personOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { computed, onMounted } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const router = useRouter();
const auth = useAuthStore();
const prefs = usePreferencesStore();
const loggingOut = ref(false);
const errorMessage = ref('');
const maintenanceOpen = ref(false);
const maintenanceMessage = ref('');

const userName = computed(() => auth.user?.name || 'AutoValor User');
const userEmail = computed(() => auth.user?.email || 'No email available');
const initials = computed(() => {
  const parts = userName.value.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AV';
});
const shortAddress = computed(() => [prefs.address.city, prefs.address.country].filter(Boolean).join(', '));
const addressPreview = computed(() => {
  const values = [prefs.address.address, prefs.address.city, prefs.address.country].filter(Boolean);
  return values.length ? values.join(' · ') : '';
});

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  await refreshProfile();
});

async function refreshProfile() {
  errorMessage.value = '';
  try {
    await auth.refreshMe();
    prefs.init(auth.user?.id);
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load your profile.';
  }
}

function goEdit() {
  router.push('/profile/edit');
}

function goListings() {
  router.push('/profile/listings');
}

function goAddress() {
  router.push('/profile/address');
}

function goLanguage() {
  router.push('/profile/language');
}

function comingSoon(section: string) {
  errorMessage.value = '';
  maintenanceMessage.value = prefs.t('maintenanceMessage', { section });
  maintenanceOpen.value = true;
}

async function logout() {
  loggingOut.value = true;
  try {
    await auth.logout();
    router.replace('/signin?force=true');
  } finally {
    loggingOut.value = false;
  }
}
</script>

<style scoped>
.profile-header ion-toolbar {
  --background: #fff;
  --padding-top: var(--app-safe-top);
  --min-height: 74px;
  padding: 10px var(--app-page-gutter) 2px;
}
.head-row { display: flex; justify-content: space-between; align-items: center; }
.title-row { display: flex; align-items: center; gap: 10px; }
.logo { width: 34px; height: 34px; object-fit: contain; }
h1 { margin: 0; color: #1f222a; font-size: clamp(20px, 6vw, 24px); font-weight: 700; letter-spacing: -0.3px; }
.menu-btn { --padding-start: 0; --padding-end: 0; --color: #1f222a; }
.profile-content { --background: #fff; --padding-top: 12px; }
.wrap { padding: 6px var(--app-page-gutter) 20px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.avatar-wrap { width: 106px; height: 106px; margin: 8px auto 10px; position: relative; }
.avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
.fallback-avatar { background: #f2f3f5; color: #1f222a; border: 1px solid #e7e8ec; display: grid; place-items: center; font-size: 32px; font-weight: 800; }
.edit-avatar { position: absolute; right: -4px; bottom: 2px; width: 28px; height: 28px; border-radius: 8px; border: 0; background: #101116; color: #fff; display: grid; place-items: center; }
h2 { margin: 0; text-align: center; color: #1f222a; font-size: 28px; font-weight: 700; }
.phone { margin: 4px 0 4px; text-align: center; color: #1f222a; font-size: 13px; }
.address-preview { margin: 0 0 14px; text-align: center; color: #7a7f89; font-size: 12px; line-height: 1.35; }
.error-message { margin: 0 0 12px; color: #d92d20; text-align: center; font-size: 13px; }
.menu-list { border-top: 1px solid #efeff1; padding-top: 4px; }
.row { width: 100%; border: 0; background: transparent; min-height: 44px; display: flex; align-items: center; gap: 10px; color: #1f222a; font-size: 16px; font-weight: 500; padding: 0 0; text-align: left; }
.row:disabled { opacity: 0.6; }
.row ion-icon:first-child { font-size: 18px; color: #30333b; }
.row ion-icon:last-child { margin-left: auto; color: #1f222a; font-size: 16px; }
.row .value { margin-left: auto; color: #1f222a; font-size: 15px; font-weight: 500; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.logout { color: #ff4d4f; }
.logout ion-icon:first-child { color: #ff4d4f; }
@media (max-width: 360px) { .avatar-wrap { width: 96px; height: 96px; } h2 { font-size: 24px; } .row { min-height: 42px; font-size: 15px; } .row .value { max-width: 110px; font-size: 13px; } }
@media (min-width: 768px) { .wrap { max-width: 760px; margin: 0 auto; } }
</style>
