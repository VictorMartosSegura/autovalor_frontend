<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start"><ion-back-button default-href="/checkout" text="" /></ion-buttons>
        <ion-title>Shipping Address</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="page">
      <div class="wrap">
        <button v-for="item in addresses" :key="item.id" class="row" @click="selected = item.id">
          <div class="left">
            <div class="pin">??</div>
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.text }}</p>
            </div>
          </div>
          <ion-icon :icon="selected === item.id ? radioButtonOnOutline : radioButtonOffOutline" />
        </button>

        <button class="add">Add New Address</button>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border footer">
      <ion-button expand="block" class="primary" @click="apply">Apply</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonBackButton, IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/vue';
import { radioButtonOffOutline, radioButtonOnOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const selected = ref(String(route.query.address ?? 'home'));

const addresses = [
  { id: 'home', name: 'Home', text: '6480 Sunbrook Park, PC 5679' },
  { id: 'office', name: 'Office', text: '6993 Meadow Valley Terra, PC 3637' },
  { id: 'apartment', name: 'Apartment', text: '21833 Clyde Gallagher, PC 4662' },
  { id: 'parents', name: "Parent's House", text: '5259 Blue Bill Park, PC 4627' },
];

function apply() {
  router.replace({ path: '/checkout', query: { car: String(route.query.car ?? 'bmw-m5'), shipping: String(route.query.shipping ?? 'train'), address: selected.value } });
}
</script>

<style scoped>
.page { --background: #fff; }
.wrap { padding: 12px 16px 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.row { width: 100%; background: #f8f8f9; border: 0; border-radius: 16px; padding: 14px; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
.left { display: flex; align-items: center; gap: 10px; }
.pin { width: 34px; height: 34px; border-radius: 50%; background: #212228; display: grid; place-items: center; color: #fff; font-size: 14px; }
strong { font-size: 15px; color: #202127; }
p { margin: 4px 0 0; font-size: 12px; color: #7d8088; }
.add { margin-top: 8px; width: 100%; height: 44px; border: 0; border-radius: 22px; background: #efeff1; color: #3f424b; font-weight: 600; }
.footer { padding: 12px 16px 20px; }
.primary { --background: #07080d; --border-radius: 999px; height: 52px; text-transform: none; font-weight: 600; }
</style>
