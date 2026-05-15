<template>
  <ion-page>
    <ion-header class="ion-no-border profile-header">
      <ion-toolbar>
        <div class="head-row">
          <div class="title-row">
            <img :src="logo" alt="AutoValor" class="logo" />
            <h1>My Profile</h1>
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

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <div class="menu-list">
          <button class="row" @click="goEdit"><ion-icon :icon="personOutline" /><span>Edit Profile</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="goListings"><ion-icon :icon="carSportOutline" /><span>Listings</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Address')"><ion-icon :icon="locationOutline" /><span>Address</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Notification')"><ion-icon :icon="notificationsOutline" /><span>Notification</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Payment')"><ion-icon :icon="cardOutline" /><span>Payment</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Security')"><ion-icon :icon="shieldCheckmarkOutline" /><span>Security</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Language')"><ion-icon :icon="languageOutline" /><span>Language</span><span class="value">English (US)</span><ion-icon :icon="chevronForward" /></button>
          <div class="row static"><ion-icon :icon="moonOutline" /><span>Dark Mode</span><ion-toggle v-model="darkMode" @ionChange="toggleDark" /></div>
          <button class="row" @click="comingSoon('Privacy Policy')"><ion-icon :icon="documentTextOutline" /><span>Privacy Policy</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Help Center')"><ion-icon :icon="helpCircleOutline" /><span>Help Center</span><ion-icon :icon="chevronForward" /></button>
          <button class="row" @click="comingSoon('Invite Friends')"><ion-icon :icon="peopleOutline" /><span>Invite Friends</span><ion-icon :icon="chevronForward" /></button>
          <button class="row logout" :disabled="loggingOut" @click="logout"><ion-icon :icon="logOutOutline" /><span>{{ loggingOut ? 'Logging out...' : 'Logout' }}</span></button>
        </div>
      </div>

      <ion-alert
        :is-open="maintenanceOpen"
        header="Servicio en mantenimiento"
        :message="maintenanceMessage"
        :buttons="['Entendido']"
        css-class="maintenance-alert"
        @didDismiss="maintenanceOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonToggle, IonAlert } from '@ionic/vue';
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
import { Storage } from '@ionic/storage';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const auth = useAuthStore();
const darkMode = ref(false);
const loggingOut = ref(false);
const errorMessage = ref('');
const maintenanceOpen = ref(false);
const maintenanceMessage = ref('Esta sección estará disponible próximamente. Estamos trabajando para conectarla con AutoValor.');
const storage = new Storage();

const userName = computed(() => auth.user?.name || 'AutoValor User');
const userEmail = computed(() => auth.user?.email || 'No email available');
const initials = computed(() => {
  const parts = userName.value.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AV';
});

onMounted(async () => {
  await auth.init();
  await refreshProfile();

  const s = await storage.create();
  darkMode.value = (await s.get('dark_mode')) || false;
  document.body.classList.toggle('dark', darkMode.value);
});

async function refreshProfile() {
  errorMessage.value = '';
  try {
    await auth.refreshMe();
  } catch (error: any) {
    errorMessage.value = error?.message || 'Could not load your profile.';
  }
}

async function toggleDark() {
  const s = await storage.create();
  await s.set('dark_mode', darkMode.value);
  document.body.classList.toggle('dark', darkMode.value);
}

function goEdit() {
  router.push('/profile/edit');
}

function goListings() {
  router.push('/profile/listings');
}

function comingSoon(section = 'This section') {
  errorMessage.value = '';
  maintenanceMessage.value = `${section} está en mantenimiento. Esta funcionalidad estará disponible próximamente.`;
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

.head-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

h1 {
  margin: 0;
  color: #1f222a;
  font-size: clamp(20px, 6vw, 24px);
  font-weight: 700;
  letter-spacing: -0.3px;
}

.menu-btn {
  --padding-start: 0;
  --padding-end: 0;
  --color: #1f222a;
}

.profile-content {
  --background: #fff;
  --padding-top: 12px;
}

.wrap {
  padding: 6px var(--app-page-gutter) 20px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.avatar-wrap {
  width: 106px;
  height: 106px;
  margin: 8px auto 10px;
  position: relative;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.fallback-avatar {
  background: #f2f3f5;
  color: #1f222a;
  border: 1px solid #e7e8ec;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: 800;
}

.edit-avatar {
  position: absolute;
  right: -4px;
  bottom: 2px;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 0;
  background: #101116;
  color: #fff;
  display: grid;
  place-items: center;
}

h2 {
  margin: 0;
  text-align: center;
  color: #1f222a;
  font-size: 28px;
  font-weight: 700;
}

.phone {
  margin: 4px 0 14px;
  text-align: center;
  color: #1f222a;
  font-size: 13px;
}

.error-message {
  margin: 0 0 12px;
  color: #d92d20;
  text-align: center;
  font-size: 13px;
}

.menu-list {
  border-top: 1px solid #efeff1;
  padding-top: 4px;
}

.row {
  width: 100%;
  border: 0;
  background: transparent;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #1f222a;
  font-size: 16px;
  font-weight: 500;
  padding: 0 0;
  text-align: left;
}

.row:disabled {
  opacity: 0.6;
}

.row ion-icon:first-child {
  font-size: 18px;
  color: #30333b;
}

.row ion-icon:last-child {
  margin-left: auto;
  color: #1f222a;
  font-size: 16px;
}

.row .value {
  margin-left: auto;
  color: #1f222a;
  font-size: 15px;
  font-weight: 500;
}

.row.static :deep(ion-toggle) {
  margin-left: auto;
  --track-background: #ececef;
  --track-background-checked: #1f222a;
  --handle-background: #ffffff;
  --handle-background-checked: #ffffff;
  transform: scale(0.9);
}

.logout {
  color: #ff4d4f;
}

.logout ion-icon:first-child {
  color: #ff4d4f;
}

@media (max-width: 360px) {
  .avatar-wrap {
    width: 96px;
    height: 96px;
  }

  h2 {
    font-size: 24px;
  }

  .row {
    min-height: 42px;
    font-size: 15px;
  }
}

@media (min-width: 768px) {
  .wrap {
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>
