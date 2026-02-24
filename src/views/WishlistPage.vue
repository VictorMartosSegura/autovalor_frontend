<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <div class="wl-topbar">
          <h1>My Wishlist</h1>
          <div class="icons">
            <ion-button fill="clear" size="small"><ion-icon :icon="heartOutline" /></ion-button>
            <ion-button fill="clear" size="small"><ion-icon :icon="searchOutline" /></ion-button>
          </div>
        </div>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="grid" v-if="wishCars.length">
        <article v-for="car in wishCars" :key="car.id" class="card" @click="goToCar(car.id)">
          <button class="fav-btn" @click.stop="wishlist.toggle(car.id)">
            <ion-icon :icon="heart" />
          </button>
          <div class="image-wrap"><img :src="car.images[0]" :alt="car.brand + ' ' + car.model" /></div>
          <h3>{{ car.model }}</h3>
          <div class="meta"><ion-icon :icon="star" />{{ car.rating }} <span class="badge">New</span></div>
          <strong>\${{ formatPrice(car.price) }}</strong>
        </article>
      </div>

      <div v-else class="empty">
        <h3>Your wishlist is empty</h3>
        <p>Add cars from Home to see them here.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonContent, IonButton, IonIcon 

} from '@ionic/vue';

import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { heart, heartOutline, searchOutline, star } from 'ionicons/icons';

import { useWishlistStore } from '@/stores/wishlist';
import { CARS } from '@/data/cars';

const router = useRouter();
const wishlist = useWishlistStore();
wishlist.init();

const wishCars = computed(() => CARS.filter((c) => wishlist.ids.includes(c.id)));

function goToCar(id: string) {
  router.push(`/car/${id}`);
}

function formatPrice(n: number) {
  return n.toLocaleString('en-US');
}
</script>
<style scoped>
.wl-topbar { display: flex; justify-content: space-between; align-items: center; padding: 2px 6px; }
.wl-topbar h1 { margin: 0; font-size: 19px; font-weight: 900; }
.icons ion-icon { color: #121212; font-size: 18px; }

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 8px 14px 16px;
}
.card {
  position: relative;
  border: 1px solid #efefef;
  border-radius: 14px;
  padding: 10px;
  background: #fff;
}
.image-wrap {
  height: 84px;
  border-radius: 10px;
  background: #f7f7f7;
  display: grid;
  place-items: center;
  margin-bottom: 8px;
}
.image-wrap img { width: 92%; height: 92%; object-fit: contain; }
.fav-btn {
  position: absolute; right: 10px; top: 10px;
  border: none; background: transparent;
}
.fav-btn ion-icon { font-size: 14px; color: #111; }
h3 { margin: 0 0 4px; font-size: 13px; font-weight: 800; }
.meta { display: flex; align-items: center; gap: 4px; font-size: 11px; opacity: .8; margin-bottom: 4px; }
.meta ion-icon { font-size: 11px; }
.badge { background: #efefef; border-radius: 6px; padding: 1px 5px; font-size: 9px; }
strong { font-size: 13px; }

.empty { text-align: center; margin-top: 60px; color: #666; }
.empty h3 { font-size: 16px; color: #111; }
</style>