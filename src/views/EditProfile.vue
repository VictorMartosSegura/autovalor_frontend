<template>
  <ion-page>
    <ion-header class="ion-no-border edit-header">
      <ion-toolbar>
        <div class="head-row">
          <ion-button fill="clear" class="back" @click="goBack">
            <ion-icon :icon="arrowBack" />
          </ion-button>
          <h1>Edit Profile</h1>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="edit-content">
      <div class="wrap">
        <div class="field"><ion-input v-model="fullName" /></div>
        <div class="field"><ion-input v-model="username" /></div>
        <div class="field"><ion-input v-model="birthDate" /></div>

        <div class="field icon-left">
          <ion-icon :icon="mail" />
          <ion-input v-model="email" />
        </div>

        <div class="field icon-both">
          <ion-icon :icon="lockClosed" />
          <ion-input v-model="password" :type="showPassword ? 'text' : 'password'" />
          <button class="eye" @click="showPassword = !showPassword">
            <ion-icon :icon="showPassword ? eyeOff : eye" />
          </button>
        </div>

        <div class="field phone-field">
          <span class="flag">🇪🇸</span>
          <ion-icon :icon="chevronDown" class="down small" />
          <ion-input v-model="phone" />
        </div>

        <div class="field icon-both">
          <ion-icon :icon="person" />
          <ion-input v-model="gender" />
          <ion-icon :icon="chevronDown" class="down" />
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="save">Update</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonPage, IonToolbar } from '@ionic/vue';
import { arrowBack, chevronDown, eye, eyeOff, lockClosed, mail, person } from 'ionicons/icons';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const fullName = ref('Victor Martos');
const username = ref('VictorM');
const birthDate = ref('12/01/2001');
const email = ref('victormartos@gmail.com');
const password = ref('123456789');
const showPassword = ref(false);
const phone = ref('+34 667 378 399');
const gender = ref('Male');

function goBack() {
  router.back();
}

function save() {
  router.replace('/tabs/profile');
}
</script>

<style scoped>
.edit-header ion-toolbar {
  --background: #fff;
  --border-width: 0;
  padding: 8px 16px 2px;
}

.head-row {
  display: flex;
  align-items: center;
  gap: 4px;
}

.back {
  --padding-start: 0;
  --padding-end: 0;
  --color: #1f222a;
  margin-right: 2px;
}

h1 {
  margin: 0;
  color: #1f222a;
  font-size: 37px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.edit-content {
  --background: #fff;
}

.wrap {
  padding: 10px 16px 20px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.field {
  min-height: 56px;
  border: 1.4px solid #787c87;
  border-radius: 12px;
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 12px;
}

.field :deep(ion-input) {
  --color: #1f222a;
  font-size: 15px;
}

.icon-left ion-icon,
.icon-both ion-icon,
.phone-field ion-icon {
  color: #1f222a;
  font-size: 16px;
}

.icon-both :deep(ion-input),
.phone-field :deep(ion-input) {
  flex: 1;
}

.eye {
  margin-left: auto;
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  color: #1f222a;
}

.flag {
  font-size: 14px;
  line-height: 1;
}

.down.small {
  font-size: 12px;
  margin-right: 2px;
}

.down {
  margin-left: auto;
}

.footer {
  padding: 10px 16px 24px;
  background: #fff;
}

.primary {
  --background: #07080d;
  --color: #fff;
  --border-radius: 999px;
  height: 54px;
  text-transform: none;
  font-weight: 600;
  font-size: 18px;
}
</style>
