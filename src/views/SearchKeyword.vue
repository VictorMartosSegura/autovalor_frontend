<template>
  <ion-page>
    <ion-content class="search-page">
      <div class="search-container">
        <div class="search-top-row">
          <ion-button fill="clear" class="back-btn" @click="goBack">
            <ion-icon :icon="arrowBackOutline" />
          </ion-button>

          <div class="search-input-wrap">
            <button type="button" class="icon-btn" aria-label="Search" @click="goToResults()">
              <ion-icon :icon="searchOutline" class="search-icon" />
            </button>
            <ion-input
              v-model="query"
              placeholder="Search"
              class="search-input"
              @keyup.enter="goToResults()"
              @ionInput="onInput"
            />
            <ion-icon :icon="optionsOutline" class="filter-icon" />
          </div>
        </div>

        <div class="recent-header">
          <span class="recent-title">Recent</span>
          <button type="button" class="clear-btn" @click="clearAll">Clear All</button>
        </div>

        <div class="recent-list">
          <div v-for="item in recentKeywords" :key="item" class="recent-item" @click="goToResults(item)">
            <span class="recent-text">{{ item }}</span>
            <button type="button" class="remove-btn" @click.stop="removeItem(item)">
              <ion-icon :icon="closeOutline" />
            </button>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonContent, IonIcon, IonInput, IonPage } from '@ionic/vue';
import { arrowBackOutline, closeOutline, optionsOutline, searchOutline } from 'ionicons/icons';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const query = ref(String(route.query.q ?? ''));
const recentKeywords = ref([
  'McLaren',
  'Mustang',
  'Camaro',
  'Audi Sports',
  'BMW M4',
  'Tesla',
  'Mercedes Benz',
  'Toyota',
]);

function goBack() {
  router.back();
}

function clearAll() {
  recentKeywords.value = [];
}

function removeItem(item: string) {
  recentKeywords.value = recentKeywords.value.filter((x) => x !== item);
}

function onInput(event: CustomEvent) {
  const value = String((event.detail as { value?: string }).value ?? '');
  query.value = value;
}

function goToResults(value?: string) {
  const q = (value ?? query.value).trim();
  if (!q) return;
  if (!recentKeywords.value.includes(q)) {
    recentKeywords.value = [q, ...recentKeywords.value].slice(0, 10);
  }
  router.push({ path: '/search/results', query: { q } });
}
</script>

<style scoped>
.search-page {
  --background: #ffffff;
}

.search-container {
  min-height: 100%;
  padding: 42px 16px 24px;
  font-family: 'SF Pro Text', 'Segoe UI', Arial, sans-serif;
}

.search-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn {
  --color: #1f222a;
  --padding-start: 0;
  --padding-end: 0;
  margin: 0;
}

.search-input-wrap {
  flex: 1;
  height: 42px;
  border: 1.5px solid #1f222a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
}

.search-icon,
.filter-icon {
  font-size: 18px;
  color: #1f222a;
}

.icon-btn {
  border: 0;
  background: transparent;
  display: grid;
  place-items: center;
  padding: 0;
}

.search-input {
  flex: 1;
  --color: #1f222a;
  --placeholder-color: #a4a6ad;
  --placeholder-opacity: 1;
  font-size: 14px;
}

.recent-header {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2px 10px;
  border-bottom: 1px solid #efefef;
}

.recent-title {
  color: #1f222a;
  font-size: 26px;
  font-weight: 700;
}

.clear-btn {
  border: 0;
  background: transparent;
  color: #1f222a;
  font-size: 14px;
  font-weight: 500;
}

.recent-list {
  padding-top: 8px;
}

.recent-item {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.recent-text {
  color: #676a72;
  font-size: 14px;
}

.remove-btn {
  border: 0;
  background: transparent;
  color: #8a8d94;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
}

.remove-btn ion-icon {
  font-size: 16px;
}
</style>
