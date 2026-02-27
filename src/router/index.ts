import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayout from '@/views/TabsLayout.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/splash' },
  { path: '/splash', component: () => import('@/views/SplashScreen.vue') },
  { path: '/letsyouin', component: () => import('@/views/LetsYouIn.vue') },
  { path: '/signup', component: () => import('@/views/SignUp.vue') },
  { path: '/search', component: () => import('@/views/SearchKeyword.vue') },
  { path: '/search/results', component: () => import('@/views/SearchResults.vue') },
  { path: '/profileblank', component: () => import('@/views/ProfileBlankForm.vue') },
  { path: '/createnewpassword', component: () => import('@/views/CreateNewPassword.vue') },
  { path: '/signin', component: () => import('@/views/SignIn.vue') },
  { path: '/profile/edit', component: () => import('@/views/EditProfile.vue') },
  {
    path: '/tabs/',
    component: TabsLayout,
    children: [
      { path: 'home', component: () => import('@/views/HomePage.vue') },
      { path: 'wishlist', component: () => import('@/views/WishlistPage.vue') },
      { path: 'orders', component: () => import('@/views/OrdersPage.vue') },
      { path: 'sell', component: () => import('@/views/OrdersPage.vue') },
      { path: 'messages', component: () => import('@/views/MessagesPage.vue') },
      { path: 'profile', component: () => import('@/views/ProfilePage.vue') },
    ],
  },
  { path: '/car/:id', component: () => import('@/views/CarDetailPage.vue') },
  { path: '/offer/:id', component: () => import('@/views/OfferPage.vue') },
  { path: '/offer/:id/accepted', component: () => import('@/views/OfferAcceptedPage.vue') },
  { path: '/checkout', component: () => import('@/views/CheckoutPage.vue') },
  { path: '/shipping-address', component: () => import('@/views/ShippingAddressPage.vue') },
  { path: '/choose-shipping', component: () => import('@/views/ChooseShippingPage.vue') },
  { path: '/payment-methods', component: () => import('@/views/PaymentMethodsPage.vue') },
  { path: '/review-summary', component: () => import('@/views/ReviewSummaryPage.vue') },
  { path: '/order-success', component: () => import('@/views/OrderSuccessPage.vue') },
  { path: '/orders/:id', component: () => import('@/views/OrderTrackPage.vue') },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
