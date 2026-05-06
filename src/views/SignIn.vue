<template>
  <ion-page>
    <ion-header class="header-flat">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/letsyouin" text="" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="signin-content">
      <div class="signin-container">
        <div class="logo-wrap">
          <img :src="autovalorLogo" alt="AutoValor logo" class="signin-logo" />
        </div>

        <h1 class="signin-title">Inicia sesión</h1>

        <div class="form-block">
          <div class="input-box">
            <ion-icon :icon="mail" class="input-icon" />
            <ion-input v-model="email" type="email" placeholder="Email" autocomplete="email" />
          </div>

          <div class="input-box">
            <ion-icon :icon="lockClosed" class="input-icon" />
            <ion-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Contraseña"
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword" aria-label="Toggle password visibility">
              <ion-icon :icon="showPassword ? eyeOff : eye" class="eye-icon" />
            </button>
          </div>

          <label class="remember-row">
            <input v-model="rememberMe" type="checkbox" class="remember-checkbox" />
            <span>Recordarme</span>
          </label>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

          <ion-button expand="block" class="signin-btn" :disabled="auth.loading" @click="handleLogin">
            <ion-spinner v-if="auth.loading" name="crescent" />
            <span v-else>Entrar</span>
          </ion-button>

          <button type="button" class="forgot-btn" @click="goToForgotPassword">¿Has olvidado la contraseña?</button>
        </div>

        <div class="divider-row">
          <div class="divider-line"></div>
          <div class="divider-text">o continúa con</div>
          <div class="divider-line"></div>
        </div>

        <div class="social-grid">
          <ion-button fill="outline" class="social-icon-btn" @click="loginWithFacebook">
            <img :src="facebookLogo" alt="Facebook" class="social-logo" />
          </ion-button>
          <ion-button fill="outline" class="social-icon-btn" @click="loginWithGoogle">
            <img :src="googleLogo" alt="Google" class="social-logo" />
          </ion-button>
          <ion-button fill="outline" class="social-icon-btn" @click="loginWithApple">
            <img :src="appleLogo" alt="Apple" class="social-logo" />
          </ion-button>
        </div>

        <div class="signup-row">
          ¿No tienes cuenta?
          <span class="signup-link" @click="goToSignUp">Regístrate</span>
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
import { eye, eyeOff, lockClosed, mail } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import appleLogo from '@/assets/logos/apple.png';
import autovalorLogo from '@/assets/logos/autovalor_logo.png';
import facebookLogo from '@/assets/logos/facebook.png';
import googleLogo from '@/assets/logos/google.png';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const showPassword = ref(false);
const errorMessage = ref('');

async function handleLogin() {
  errorMessage.value = '';

  if (!email.value.trim() || !password.value) {
    errorMessage.value = 'Introduce email y contraseña.';
    return;
  }

  try {
    await auth.login({
      email: email.value.trim().toLowerCase(),
      password: password.value,
    });

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/tabs/home';
    router.replace(redirect);
  } catch (error: any) {
    errorMessage.value = error?.message || auth.error || 'No se pudo iniciar sesión.';
  }
}

function goToForgotPassword() {
  router.push('/createnewpassword');
}

function goToSignUp() {
  router.push('/signup');
}

function loginWithFacebook() {
  errorMessage.value = 'Login social pendiente de integración.';
}

function loginWithGoogle() {
  errorMessage.value = 'Login social pendiente de integración.';
}

function loginWithApple() {
  errorMessage.value = 'Login social pendiente de integración.';
}
</script>

<style scoped>
.signin-content {
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

.signin-container {
  min-height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 22px 34px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.logo-wrap {
  width: 110px;
  height: 94px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
}

.signin-logo {
  width: 230px;
  max-width: none;
}

.signin-title {
  margin: 0;
  color: #1f222a;
  font-size: 28px;
  line-height: 1.2;
  letter-spacing: -0.1px;
  font-weight: 700;
  text-align: center;
}

.form-block {
  width: 100%;
  margin-top: 26px;
}

.input-box {
  width: 100%;
  height: 54px;
  border-radius: 14px;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  padding: 0 14px;
  gap: 10px;
  margin-bottom: 14px;
}

.input-box ion-input {
  --placeholder-color: #a2a5ad;
  --placeholder-opacity: 1;
  --color: #1f222a;
  font-size: 16px;
}

.input-icon,
.eye-icon {
  font-size: 18px;
  color: #9a9ca3;
}

.eye-btn {
  border: 0;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-row {
  margin-top: 4px;
  margin-bottom: 16px;
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
  width: 24px;
  height: 24px;
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
  left: 6px;
  top: 2px;
  width: 6px;
  height: 12px;
  border: solid #1f222a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.error-message {
  margin: -2px 0 14px;
  color: #d92d20;
  font-size: 14px;
  line-height: 1.35;
  text-align: center;
}

.signin-btn {
  --background: #3b3b3f;
  --color: #ffffff;
  --border-radius: 999px;
  --box-shadow: none;
  --padding-top: 0;
  --padding-bottom: 0;
  height: 54px;
  font-size: 17px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.forgot-btn {
  display: block;
  margin: 16px auto 0;
  border: 0;
  background: transparent;
  color: #1f222a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.divider-row {
  width: 100%;
  margin: 28px 0 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.divider-line {
  height: 1px;
  flex: 1;
  background: #ececec;
}

.divider-text {
  color: #555860;
  font-size: 15px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.social-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.social-icon-btn {
  --background: #ffffff;
  --color: #1f222a;
  --border-color: #e6e7eb;
  --border-style: solid;
  --border-width: 1px;
  --border-radius: 14px;
  --box-shadow: none;
  height: 48px;
  margin: 0;
}

.social-logo {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.signup-row {
  margin-top: 24px;
  text-align: center;
  color: #b0b3b9;
  font-size: 14px;
  font-weight: 400;
}

.signup-link {
  margin-left: 8px;
  color: #1b1d23;
  font-weight: 700;
  cursor: pointer;
}

ion-back-button {
  --color: #1f222a;
}
</style>
