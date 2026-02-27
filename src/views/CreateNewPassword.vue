<template>
  <ion-page>
    <ion-header class="header-flat">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/signup" text="" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="createpw-content">
      <div class="createpw-container">
        <h1 class="top-title">Create New Password</h1>

        <img :src="newPasswordIllustration" alt="Create new password illustration" class="hero-illustration" />
        <br />

        <p class="section-title">Create Your New Password</p>

        <div class="form-block">
          <div class="input-box">
            <ion-icon :icon="lockClosed" class="input-icon" />
            <ion-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Password"
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
              <ion-icon :icon="showPassword ? eyeOff : eye" class="eye-icon" />
            </button>
          </div>

          <div class="input-box">
            <ion-icon :icon="lockClosed" class="input-icon" />
            <ion-input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Password"
            />
            <button
              type="button"
              class="eye-btn"
              @click="showConfirmPassword = !showConfirmPassword"
              aria-label="Toggle confirm password visibility"
            >
              <ion-icon :icon="showConfirmPassword ? eyeOff : eye" class="eye-icon" />
            </button>
          </div>

          <label class="remember-row">
            <input v-model="rememberMe" type="checkbox" class="remember-checkbox" />
            <span>Remember me</span>
          </label>
        </div>

        <ion-button expand="block" class="continue-btn" @click="showSuccess">Continue</ion-button>
      </div>
    </ion-content>

    <ion-modal :is-open="successOpen" class="success-modal" :backdrop-dismiss="false">
      <div class="success-card">
        <div class="success-icon-wrap">
          <ion-icon :icon="shieldCheckmark" class="success-icon" />
        </div>
        <h2>Congratulations!</h2>
        <p>Your account is ready to use. You will be redirected to the Home page in a few seconds.</p>
        <div class="loader-dots" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
      </div>
    </ion-modal>
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
  IonModal,
  IonPage,
  IonToolbar,
} from '@ionic/vue';
import { eye, eyeOff, lockClosed, shieldCheckmark } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import newPasswordIllustration from '@/assets/logos/newPassword_image.png';

const router = useRouter();

const password = ref('');
const confirmPassword = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const successOpen = ref(false);

function showSuccess() {
  successOpen.value = true;
  setTimeout(() => {
    router.replace('/letsyouin');
  }, 2200);
}
</script>

<style scoped>
.createpw-content {
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
}

ion-back-button {
  --color: #1f222a;
}

.createpw-container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 20px 28px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.top-title {
  margin: 0;
  color: #1f222a;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
}

.hero-illustration {
  width: 100%;
  max-width: 272px;
  margin: 10px auto 20px;
  display: block;
}

.section-title {
  margin: 12px 0 14px;
  color: #262731;
  font-size: 16px;
  font-weight: 500;
}

.form-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-box {
  width: 100%;
  height: 52px;
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

.input-icon,
.eye-icon {
  color: #a2a4aa;
  font-size: 18px;
  flex-shrink: 0;
}

.eye-btn {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
}

.remember-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #1f222a;
  font-size: 14px;
  font-weight: 500;
}

.remember-checkbox {
  appearance: none;
  width: 23px;
  height: 23px;
  border: 3px solid #1f222a;
  border-radius: 7px;
  background: #ffffff;
  margin: 0;
  cursor: pointer;
  position: relative;
}

.remember-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 6px;
  height: 12px;
  border: solid #1f222a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.continue-btn {
  margin-top: auto;
  --background: #07080d;
  --color: #ffffff;
  --border-radius: 999px;
  --box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  height: 56px;
  text-transform: none;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 0;
}

.success-modal::part(backdrop) {
  background: rgba(0, 0, 0, 0.3);
}

.success-modal::part(content) {
  --width: 300px;
  --height: 360px;
  --border-radius: 26px;
}

.success-card {
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 26px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.success-icon-wrap {
  width: 104px;
  height: 104px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 20%, #2b2c30 0, #111217 65%);
  color: #ffffff;
  display: grid;
  place-items: center;
}

.success-icon {
  font-size: 46px;
}

.success-card h2 {
  margin: 18px 0 10px;
  color: #1f222a;
  font-size: 30px;
}

.success-card p {
  margin: 0;
  color: #4f525a;
  font-size: 17px;
  line-height: 1.4;
}

.loader-dots {
  margin-top: auto;
  display: flex;
  gap: 8px;
}

.loader-dots span {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #1f222a;
  opacity: 0.2;
  animation: pulse 0.8s infinite ease-in-out;
}

.loader-dots span:nth-child(2) {
  animation-delay: 0.1s;
}

.loader-dots span:nth-child(3) {
  animation-delay: 0.2s;
}

.loader-dots span:nth-child(4) {
  animation-delay: 0.3s;
}

.loader-dots span:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.2;
  }
  50% {
    opacity: 1;
  }
}
</style>
