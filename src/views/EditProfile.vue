<template>
  <ion-page>
    <ion-header class="ion-no-border edit-header">
      <ion-toolbar>
        <div class="head-row">
          <ion-button fill="clear" class="back" @click="goBack">
            <ion-icon :icon="arrowBack" />
          </ion-button>
          <h1>{{ prefs.t('editProfile') }}</h1>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content class="edit-content">
      <div class="wrap">
        <div class="avatar-preview">{{ initials }}</div>

        <div class="field">
          <ion-input v-model="fullName" :label="prefs.t('fullName')" label-placement="stacked" :placeholder="prefs.t('fullName')" />
        </div>

        <div class="field icon-left">
          <ion-icon :icon="mail" />
          <ion-input v-model="email" type="email" :label="prefs.t('email')" label-placement="stacked" :placeholder="prefs.t('email')" />
        </div>

        <div class="field muted-field">
          <ion-input v-model="role" :label="prefs.t('role')" label-placement="stacked" readonly />
        </div>

        <div class="field muted-field">
          <ion-input v-model="createdAt" :label="prefs.t('memberSince')" label-placement="stacked" readonly />
        </div>

        <p class="helper-text">{{ prefs.t('profileStorageHint') }}</p>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" :disabled="saving" @click="save">
        <ion-spinner v-if="saving" name="crescent" />
        <span v-else>{{ prefs.t('update') }}</span>
      </ion-button>
      <ion-button expand="block" fill="clear" class="logout-btn" :disabled="loggingOut" @click="logout">
        {{ loggingOut ? prefs.t('loggingOut') : prefs.t('logout') }}
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonFooter, IonHeader, IonIcon, IonInput, IonPage, IonSpinner, IonToolbar } from '@ionic/vue';
import { arrowBack, mail } from 'ionicons/icons';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/auth';
import { usePreferencesStore } from '@/stores/preferences';

const router = useRouter();
const auth = useAuthStore();
const prefs = usePreferencesStore();

const fullName = ref('');
const email = ref('');
const role = ref('');
const createdAt = ref('');
const saving = ref(false);
const loggingOut = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const initials = computed(() => {
  const parts = fullName.value.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AV';
});

onMounted(async () => {
  await auth.init();
  prefs.init(auth.user?.id);
  await loadProfile();
});

async function loadProfile() {
  try {
    const user = await auth.refreshMe();
    fullName.value = user?.name || '';
    email.value = user?.email || '';
    role.value = user?.role || '';
    createdAt.value = user?.createdAt ? dayjs(user.createdAt).format('DD MMM YYYY') : '—';
  } catch (error: any) {
    errorMessage.value = error?.message || prefs.t('couldNotLoadProfile');
  }
}

function goBack() {
  router.back();
}

async function save() {
  errorMessage.value = '';
  successMessage.value = '';

  if (!fullName.value.trim()) {
    errorMessage.value = prefs.t('fullNameRequired');
    return;
  }

  if (!email.value.trim()) {
    errorMessage.value = prefs.t('emailRequired');
    return;
  }

  saving.value = true;
  try {
    await auth.updateProfile({
      name: fullName.value.trim(),
      email: email.value.trim().toLowerCase(),
    });
    successMessage.value = prefs.t('profileUpdated');
    router.replace('/tabs/profile');
  } catch (error: any) {
    errorMessage.value = error?.message || prefs.t('couldNotUpdateProfile');
  } finally {
    saving.value = false;
  }
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

.avatar-preview {
  width: 106px;
  height: 106px;
  border-radius: 50%;
  background: #f2f3f5;
  border: 1px solid #e7e8ec;
  color: #1f222a;
  margin: 8px auto 22px;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: 800;
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

.icon-left ion-icon {
  color: #1f222a;
  font-size: 16px;
}

.icon-left :deep(ion-input) {
  flex: 1;
}

.muted-field {
  background: #f6f6f7;
  border-color: transparent;
}

.helper-text {
  color: #7d8088;
  font-size: 13px;
  line-height: 1.45;
  margin: 4px 0 0;
}

.error-message,
.success-message {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.35;
}

.error-message {
  color: #d92d20;
}

.success-message {
  color: #027a48;
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

.logout-btn {
  --color: #ff4d4f;
  text-transform: none;
  font-weight: 600;
  margin-top: 6px;
}

@media (max-width: 360px) {
  h1 {
    font-size: 32px;
  }

  .avatar-preview {
    width: 96px;
    height: 96px;
  }
}

@media (min-width: 768px) {
  .wrap,
  .footer {
    max-width: 760px;
    margin: 0 auto;
  }
}
</style>