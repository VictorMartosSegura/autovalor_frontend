<template>
  <ion-page>
    <ion-header class="header-flat">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/splash" text="" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="letsyouin-content">
      <div class="letsyouin-container">
        <div class="logo-wrap">
          <img :src="autovalorLogo" alt="AutoValor logo" class="letsyouin-logo" />
        </div>

        <h1 class="letsyouin-title">Let's you in</h1>

        <div class="social-btns">
          <ion-button expand="block" fill="outline" class="social-btn" @click="loginWithFacebook">
            <img slot="start" :src="facebookLogo" alt="Facebook" class="social-logo" />
            Continue with Facebook
          </ion-button>

          <ion-button expand="block" fill="outline" class="social-btn" @click="loginWithGoogle">
            <img slot="start" :src="googleLogo" alt="Google" class="social-logo" />
            Continue with Google
          </ion-button>

          <ion-button expand="block" fill="outline" class="social-btn" @click="loginWithApple">
            <img slot="start" :src="appleLogo" alt="Apple" class="social-logo" />
            Continue with Apple
          </ion-button>
        </div>

        <div class="divider-row">
          <div class="divider-line"></div>
          <div class="divider-text">or</div>
          <div class="divider-line"></div>
        </div>

        <ion-button expand="block" class="signin-btn" @click="goToSignIn">
          Sign in with password
        </ion-button>

        <div class="signup-row">
          Don't have an account?
          <span class="signup-link" @click="goToSignUp">Sign up</span>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/vue';
import { useRouter } from 'vue-router';

import appleLogo from '@/assets/logos/apple.png';
import autovalorLogo from '@/assets/logos/autovalor_logo.png';
import facebookLogo from '@/assets/logos/facebook.png';
import googleLogo from '@/assets/logos/google.png';

const router = useRouter();

function goToSignIn() {
  router.push('/signin');
}

function goToSignUp() {
  router.push('/signup');
}

function loginWithFacebook() {
  console.log('facebook login');
}

function loginWithGoogle() {
  console.log('google login');
}

function loginWithApple() {
  console.log('apple login');
}
</script>

<style scoped>
.letsyouin-content {
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

.letsyouin-container {
  min-height: 100%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 78px 22px 36px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.logo-wrap {
  width: 142px;
  height: 118px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}

.letsyouin-logo {
  width: 285px;
  max-width: none;
}

.letsyouin-title {
  margin: 0;
  color: #1f222a;
  font-size: 50px;
  line-height: 1.08;
  letter-spacing: -0.2px;
  font-weight: 700;
}

.social-btns {
  width: 100%;
  margin-top: 36px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.social-btn {
  --background: #ffffff;
  --color: #1f222a;
  --border-color: #e6e7eb;
  --border-style: solid;
  --border-width: 1px;
  --border-radius: 15px;
  --box-shadow: none;
  --padding-top: 0;
  --padding-bottom: 0;
  --padding-start: 18px;
  --padding-end: 18px;
  height: 52px;
  font-size: 17px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.social-btn::part(native),
.signin-btn::part(native) {
  font-family: inherit;
}

.social-logo {
  width: 21px;
  height: 21px;
  object-fit: contain;
  margin-right: 8px;
}

.divider-row {
  width: 100%;
  margin: 24px 0 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.divider-line {
  height: 1px;
  flex: 1;
  background: #ededed;
}

.divider-text {
  color: #7c7f87;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
}

.signin-btn {
  --background: #08090f;
  --color: #ffffff;
  --border-radius: 999px;
  --box-shadow: 0 8px 18px rgba(0, 0, 0, 0.22);
  --padding-top: 0;
  --padding-bottom: 0;
  height: 56px;
  font-size: 17px;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
}

.signup-row {
  margin-top: 38px;
  text-align: center;
  color: #9ca3af;
  font-size: 16px;
  font-weight: 400;
}

.signup-link {
  margin-left: 8px;
  color: #1b1d23;
  font-weight: 700;
  cursor: pointer;
}
</style>
