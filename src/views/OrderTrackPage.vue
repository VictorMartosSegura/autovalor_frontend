<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="track-toolbar">
        <ion-buttons slot="start"><ion-back-button default-href="/tabs/orders" text="" /></ion-buttons>
        <ion-title>Track Order</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" size="small"><ion-icon :icon="heartOutline" /></ion-button>
          <ion-button fill="clear" size="small"><ion-icon :icon="searchOutline" /></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="track-content">
      <div class="wrap">
        <div class="summary-card">
          <img :src="carImage" alt="BMW M5" />
          <div>
            <h3>BMW M5 Series</h3>
            <p><span class="dot"></span> Color</p>
            <strong>$171,250</strong>
          </div>
        </div>

        <div class="progress-card">
          <div class="icons-row">
            <ion-icon :icon="cubeOutline" />
            <ion-icon :icon="busOutline" />
            <ion-icon :icon="peopleOutline" />
            <ion-icon :icon="briefcaseOutline" />
          </div>
          <div class="line"></div>
          <p>Car Delivery (Train)</p>
        </div>

        <h4>Order Status Details</h4>
        <div class="timeline">
          <div v-for="(step, i) in steps" :key="i" class="tl-item">
            <span class="tl-dot"></span>
            <div class="tl-body">
              <div class="tl-title-row">
                <strong>{{ step.title }}</strong>
                <span>{{ step.time }}</span>
              </div>
              <p>{{ step.address }}</p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButtons, IonBackButton, IonTitle, IonButton, IonIcon } from '@ionic/vue';
import { briefcaseOutline, busOutline, cubeOutline, heartOutline, peopleOutline, searchOutline } from 'ionicons/icons';
import bmw from '@/assets/cars/bmw_m5.png';

const carImage = bmw;
const steps = [
  { title: 'Order .. Delivery (Train) - Dec 17', address: '32 Manchester Ave. Ringgold, GA 30736', time: '15:20 PM' },
  { title: 'Order ... Customs Port - Dec 16', address: '4 Evergreen Street Lake Zurich, IL 60047', time: '14:40 PM' },
  { title: 'Orders are ... Train - Dec 15', address: '9177 Hillcrest Street Wheeling, WV 26003', time: '11:30 AM' },
  { title: 'Order is in Packing - Dec 15', address: '891 Glen Ridge St. Gainesville, VA 20155', time: '10:25 AM' },
  { title: 'Verified Payments - Dec 15', address: 'Users', time: '10:04 AM' },
];
</script>

<style scoped>
.track-toolbar { --background: #fff; }
.track-toolbar ion-title { font-size: 16px; font-weight: 700; color: #1f222a; }
.track-toolbar ion-button { --color: #1f222a; }
.track-content { --background: #fff; }
.wrap { padding: 12px 16px 24px; font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif; }
.summary-card { background: #f8f8f9; border-radius: 16px; padding: 12px; display: flex; gap: 10px; }
.summary-card img { width: 82px; height: 58px; object-fit: contain; background: #efeff0; border-radius: 10px; padding: 4px; }
.summary-card h3 { margin: 0; font-size: 16px; color: #1f222a; }
.summary-card p { margin: 5px 0; color: #7b7f86; font-size: 12px; }
.summary-card strong { font-size: 17px; color: #1f222a; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: #d2d5dc; display: inline-block; margin-right: 5px; }
.progress-card { margin-top: 12px; border: 1px solid #d7e9ff; border-radius: 12px; padding: 10px; }
.icons-row { display: grid; grid-template-columns: repeat(4, 1fr); text-align: center; color: #8d9198; font-size: 22px; }
.line { margin: 10px 0 8px; border-bottom: 2px dashed #cfd2d8; }
.progress-card p { margin: 0; text-align: center; color: #1f222a; font-weight: 600; }
h4 { margin: 18px 0 10px; color: #1f222a; font-size: 15px; }
.timeline { border-left: 2px dotted #d0d3da; margin-left: 11px; }
.tl-item { position: relative; padding-left: 18px; margin-bottom: 16px; }
.tl-dot {
  position: absolute; left: -11px; top: 2px; width: 14px; height: 14px; border-radius: 50%;
  background: #fff; border: 3px solid #111216;
}
.tl-title-row { display: flex; justify-content: space-between; gap: 8px; }
.tl-title-row strong { font-size: 14px; color: #1f222a; }
.tl-title-row span { font-size: 11px; color: #8b8f97; }
.tl-body p { margin: 4px 0 0; font-size: 12px; color: #8b8f97; }
</style>
