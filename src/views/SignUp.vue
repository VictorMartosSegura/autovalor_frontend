<template>
  <ion-page>
    <ion-header class="header-flat">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/letsyouin" text="" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="signup-content">
      <div class="signup-container">
        <h1 class="signup-title">Fill Your Profile</h1>

        <div class="avatar-wrap">
          <div class="avatar-circle">
            <ion-icon :icon="person" class="avatar-icon" />
          </div>
          <button type="button" class="avatar-edit-btn" aria-label="Edit profile image">
            <ion-icon :icon="create" />
          </button>
        </div>

        <div class="form-block">
          <div class="input-box">
            <ion-input v-model="fullName" placeholder="Full Name" />
          </div>

          <div class="input-box">
            <ion-icon :icon="personOutline" class="input-icon" />
            <ion-input v-model="username" placeholder="Username" />
          </div>

          <div class="input-box">
            <ion-input v-model="birthDate" placeholder="01/01/2001" />
            <ion-icon :icon="calendarOutline" class="input-icon" />
          </div>

          <div class="input-box">
            <ion-icon :icon="mail" class="input-icon" />
            <ion-input v-model="email" type="email" placeholder="Email" />
          </div>

          <div class="input-box phone-box">
            <div class="country-tag">
              <span>ES</span>
              <ion-icon :icon="chevronDown" />
            </div>
            <ion-input v-model="phone" placeholder="+1 000 000 000" />
          </div>

          <div class="input-box">
            <ion-input v-model="gender" placeholder="Gender" />
            <ion-icon :icon="chevronDown" class="input-icon" />
          </div>
        </div>

        <ion-button expand="block" class="continue-btn" @click="goToNextStep">Continue</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonToolbar,
} from '@ionic/vue';
import { calendarOutline, chevronDown, create, mail, person, personOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const fullName = ref('');
const username = ref('');
const birthDate = ref('');
const email = ref('');
const phone = ref('');
const gender = ref('');

function goToNextStep() {
  router.push('/createnewpassword');
}
</script>

<style scoped>
.signup-content {
  --background: #ffffff;
}

.header-flat {
  box-shadow: none;
}

.header-flat::after {
  display: none;
}

.header-flat ion-toolbar {
  --background: #ffffff;
  --border-width: 0;
  --min-height: 56px;
  --padding-start: 8px;
  --padding-end: 8px;
  --box-shadow: none;
}

ion-back-button {
  --color: #1f222a;
}

.signup-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px 22px 34px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.signup-title {
  margin: 0;
  color: #1f222a;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 700;
}

.avatar-wrap {
  margin: 20px auto 16px;
  width: 106px;
  height: 106px;
  position: relative;
}

.avatar-circle {
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background: #f1f2f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 58px;
  color: #d1d3db;
}

.avatar-edit-btn {
  position: absolute;
  right: -2px;
  bottom: 2px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 0;
  background: #111218;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-edit-btn ion-icon {
  font-size: 17px;
}

.form-block {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.input-box {
  width: 100%;
  height: 53px;
  border-radius: 14px;
  background: #f4f5f7;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
}

.input-box ion-input {
  --color: #23242b;
  --placeholder-color: #a3a5ac;
  --placeholder-opacity: 1;
  font-size: 15px;
}

.input-icon {
  color: #a2a4aa;
  font-size: 18px;
  flex-shrink: 0;
}

.phone-box {
  gap: 12px;
}

.country-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #7d8088;
  font-size: 14px;
}

.country-tag ion-icon {
  font-size: 13px;
}

.continue-btn {
  margin-top: 26px;
  --background: #3b3b3f;
  --color: #ffffff;
  --border-radius: 999px;
  --box-shadow: none;
  height: 54px;
  text-transform: none;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0;
}
</style>
