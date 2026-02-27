<template>
  <ion-page>
    <ion-header class="ion-no-border profile-header">
      <ion-toolbar>
        <div class="head-row">
          <div class="title-row">
            <img :src="logo" alt="AutoValor" class="logo" />
            <h1>My Profile</h1>
          </div>
          <ion-button fill="clear" size="small" class="menu-btn">
            <ion-icon :icon="ellipsisHorizontal" />
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <div class="wrap">
        <div class="avatar-wrap">
          <img class="avatar" src="https://i.pravatar.cc/220?img=12" alt="Profile" />
          <button class="edit-avatar" @click="goEdit">
            <ion-icon :icon="create" />
          </button>
        </div>

        <h2>Victor Martos</h2>
        <p class="phone">+34 667 378 399</p>

        <div class="menu-list">
          <button class="row" @click="goEdit"><ion-icon :icon="personOutline" /><span>Edit Profile</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="locationOutline" /><span>Address</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="notificationsOutline" /><span>Notification</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="cardOutline" /><span>Payment</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="shieldCheckmarkOutline" /><span>Security</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="languageOutline" /><span>Language</span><span class="value">English (US)</span><ion-icon :icon="chevronForward" /></button>
          <div class="row static"><ion-icon :icon="moonOutline" /><span>Dark Mode</span><ion-toggle v-model="darkMode" @ionChange="toggleDark" /></div>
          <button class="row"><ion-icon :icon="documentTextOutline" /><span>Privacy Policy</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="helpCircleOutline" /><span>Help Center</span><ion-icon :icon="chevronForward" /></button>
          <button class="row"><ion-icon :icon="peopleOutline" /><span>Invite Friends</span><ion-icon :icon="chevronForward" /></button>
          <button class="row logout"><ion-icon :icon="logOutOutline" /><span>Logout</span></button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon, IonToggle } from '@ionic/vue';
import {
  cardOutline,
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import logo from '@/assets/logos/autovalor_logo.png';

const router = useRouter();
const darkMode = ref(false);
const storage = new Storage();

(async () => {
  const s = await storage.create();
  darkMode.value = (await s.get('dark_mode')) || false;
  document.body.classList.toggle('dark', darkMode.value);
})();

async function toggleDark() {
  const s = await storage.create();
  await s.set('dark_mode', darkMode.value);
  document.body.classList.toggle('dark', darkMode.value);
}

function goEdit() {
  router.push('/profile/edit');
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
