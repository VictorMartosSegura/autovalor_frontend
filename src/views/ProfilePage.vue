<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>

      <!-- Avatar + info -->
      <div class="profile-header">
        <ion-avatar>
          <img src="https://i.pravatar.cc/200" />
        </ion-avatar>

        <h2>{{ name }}</h2>
        <p>{{ email }}</p>
      </div>

      <!-- Opciones -->
      <ion-list>

        <ion-item button @click="editProfile">
          <ion-label>Edit Profile</ion-label>
        </ion-item>

        <ion-item button>
          <ion-label>Address</ion-label>
        </ion-item>

        <ion-item button>
          <ion-label>Payment</ion-label>
        </ion-item>

        <ion-item button>
          <ion-label>Security</ion-label>
        </ion-item>

        <ion-item>
          <ion-label>Dark Mode</ion-label>
          <ion-toggle
            slot="end"
            v-model="darkMode"
            @ionChange="toggleDarkMode"
          />
        </ion-item>

      </ion-list>

      <!-- Logout -->
      <div class="logout">
        <ion-button expand="block" fill="outline" color="danger">
          Logout
        </ion-button>
      </div>

      <ion-toast
        :is-open="toastOpen"
        message="Profile updated"
        :duration="1200"
        @didDismiss="toastOpen = false"
      />

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonAvatar,
  IonToggle, IonButton, IonToast
} from '@ionic/vue';

import { ref, onMounted } from 'vue';
import { Storage } from '@ionic/storage';

const name = ref('Victor Martos');
const email = ref('victor@email.com');
const darkMode = ref(false);
const toastOpen = ref(false);

const storage = new Storage();

onMounted(async () => {
  const store = await storage.create();
  darkMode.value = (await store.get('dark_mode')) || false;
  applyDarkMode(darkMode.value);
});

async function toggleDarkMode() {
  const store = await storage.create();
  await store.set('dark_mode', darkMode.value);
  applyDarkMode(darkMode.value);
}

function applyDarkMode(enabled: boolean) {
  document.body.classList.toggle('dark', enabled);
}

function editProfile() {
  toastOpen.value = true;
}
</script>

<style scoped>
.profile-header {
  text-align: center;
  padding: 30px 0;
}

ion-avatar {
  margin: 0 auto 15px auto;
  width: 100px;
  height: 100px;
}

.profile-header h2 {
  margin: 5px 0;
  font-weight: 600;
}

.profile-header p {
  color: gray;
  margin: 0;
}

.logout {
  padding: 20px;
}
</style>