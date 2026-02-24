import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/tabs/home' },

  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      { path: '', redirect: '/tabs/home' },

      { path: 'home', component: () => import('@/views/Tab1Page.vue') },
      { path: 'wishlist', component: () => import('@/views/WishlistPage.vue') },
      { path: 'orders', component: () => import('@/views/OrdersPage.vue') },
      { path: 'profile', component: () => import('@/views/ProfilePage.vue') },
    ],
  },

  { path: '/car/:id', component: () => import('@/views/CarDetailPage.vue') },
  { path: '/offer/:id', component: () => import('@/views/OfferPage.vue') },
  { path: '/checkout', component: () => import('@/views/CheckoutPage.vue') },
  { path: '/orders/:id', component: () => import('@/views/OrderTrackPage.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;