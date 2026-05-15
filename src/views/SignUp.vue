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
        <h1 class="signup-title">{{ prefs.t('createAccountTitle') }}</h1>

        <div class="avatar-wrap">
          <div class="avatar-circle">
            <ion-icon :icon="person" class="avatar-icon" />
          </div>
          <button type="button" class="avatar-edit-btn" :aria-label="prefs.t('editProfile')">
            <ion-icon :icon="create" />
          </button>
        </div>

        <div class="form-block">
          <div class="input-box">
            <ion-input v-model="fullName" :placeholder="prefs.t('fullName')" autocomplete="name" />
          </div>

          <div class="input-box">
            <ion-icon :icon="mail" class="input-icon" />
            <ion-input v-model="email" type="email" :placeholder="prefs.t('email')" autocomplete="email" />
          </div>

          <div class="input-box">
            <ion-icon :icon="lockClosed" class="input-icon" />
            <ion-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="prefs.t('password')"
              autocomplete="new-password"
            />
            <button type="button" class="calendar-trigger" :aria-label="prefs.t('showPassword')" @click="showPassword = !showPassword">
              <ion-icon :icon="showPassword ? eyeOff : eye" class="input-icon" />
            </button>
          </div>

          <div class="input-box">
            <ion-icon :icon="lockClosed" class="input-icon" />
            <ion-input
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              :placeholder="prefs.t('confirmPassword')"
              autocomplete="new-password"
              @keyup.enter="handleRegister"
            />
          </div>
        </div>

        <p class="helper-text">{{ prefs.t('profileLaterHint') }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

        <ion-button expand="block" class="continue-btn" :disabled="auth.loading" @click="handleRegister">
          <ion-spinner v-if="auth.loading" name="crescent" />
          <span v-else>{{ prefs.t('signUp') }}</span>
        </ion-button>

        <div class="signin-row">
          {{ prefs.t('alreadyHaveAccount') }}
          <span class="signin-link" @click="goToSignIn">{{ prefs.t('signIn') }}</span>
        </div>
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
  IonSpinner,
  IonToolbar,
} from '@ionic/vue';
import { create, eye, eyeOff, lockClosed, mail, person } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();
const prefs = usePreferencesStore();

const fullName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const errorMessage = ref('');

onMounted(() => {
  prefs.init(auth.user?.id);
});

async function handleRegister() {
  errorMessage.value = '';

  if (!fullName.value.trim() || !email.value.trim() || !password.value) {
    errorMessage.value = prefs.t('completeRegisterFields');
    return;
  }

  if (password.value.length < 8) {
    errorMessage.value = prefs.t('passwordMinLength');
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = prefs.t('passwordsDoNotMatch');
    return;
  }

  try {
    await auth.register({
      name: fullName.value.trim(),
      email: email.value.trim().toLowerCase(),
      password: password.value,
    });

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/tabs/home';
    router.replace(redirect);
  } catch (error: any) {
    errorMessage.value = error?.message || auth.error || prefs.t('couldNotCreateAccount');
  }
}

function goToSignIn() {
  router.push('/signin');
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
  --min-height: 84px;
  --padding-top: 16px;
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

.calendar-trigger {
  border: 0;
  background: transparent;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.helper-text {
  margin: 16px 0 0;
  color: #7d8088;
  font-size: 13px;
  line-height: 1.4;
}

.error-message {
  margin: 12px 0 0;
  color: #d92d20;
  font-size: 14px;
  line-height: 1.35;
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

.signin-row {
  margin-top: 22px;
  text-align: center;
  color: #b0b3b9;
  font-size: 14px;
}

.signin-link {
  margin-left: 8px;
  color: #1b1d23;
  font-weight: 700;
  cursor: pointer;
}
</style>