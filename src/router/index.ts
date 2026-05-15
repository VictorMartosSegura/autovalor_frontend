import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsLayout from '@/views/TabsLayout.vue';
import { useAuthStore } from '@/stores/auth';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/splash' },
  { path: '/splash', component: () => import('@/views/SplashScreen.vue') },
  { path: '/letsyouin', component: () => import('@/views/LetsYouIn.vue') },
  { path: '/signup', component: () => import('@/views/SignUp.vue') },
  { path: '/search', component: () => import('@/views/SearchKeyword.vue') },
  { path: '/search/results', component: () => import('@/views/SearchResults.vue') },
  { path: '/profileblank', component: () => import('@/views/ProfileBlankForm.vue'), meta: { requiresAuth: true } },
  { path: '/createnewpassword', component: () => import('@/views/CreateNewPassword.vue') },
  { path: '/signin', component: () => import('@/views/SignIn.vue') },
  { path: '/profile/edit', component: () => import('@/views/EditProfile.vue'), meta: { requiresAuth: true } },
  { path: '/profile/listings', component: () => import('@/views/MyListingsPage.vue'), meta: { requiresAuth: true } },
  { path: '/profile/address', component: () => import('@/views/AddressPage.vue'), meta: { requiresAuth: true } },
  { path: '/profile/language', component: () => import('@/views/LanguagePage.vue'), meta: { requiresAuth: true } },
  {
    path: '/tabs/',
    component: TabsLayout,
    children: [
      { path: '', redirect: '/tabs/home' },
      { path: 'home', component: () => import('@/views/HomePage.vue') },
      { path: 'wishlist', component: () => import('@/views/WishlistPage.vue'), meta: { requiresAuth: true } },
      { path: 'orders', component: () => import('@/views/OrdersPage.vue'), meta: { requiresAuth: true } },
      { path: 'sell', component: () => import('@/views/SellCarPage.vue'), meta: { requiresAuth: true } },
      { path: 'messages', component: () => import('@/views/MessagesPage.vue'), meta: { requiresAuth: true } },
      { path: 'profile', component: () => import('@/views/ProfilePage.vue'), meta: { requiresAuth: true } },
    ],
  },
  { path: '/car/:id', component: () => import('@/views/CarDetailPage.vue') },
  { path: '/offer/:id/create', component: () => import('@/views/MakeOfferPage.vue'), meta: { requiresAuth: true } },
  { path: '/offer/:id', component: () => import('@/views/OfferPage.vue'), meta: { requiresAuth: true } },
  { path: '/offer/:id/accepted', component: () => import('@/views/OfferAcceptedPage.vue'), meta: { requiresAuth: true } },
  { path: '/chat/:id', component: () => import('@/views/ChatPage.vue'), meta: { requiresAuth: true } },
  { path: '/checkout', component: () => import('@/views/CheckoutPage.vue'), meta: { requiresAuth: true } },
  { path: '/shipping-address', component: () => import('@/views/ShippingAddressPage.vue'), meta: { requiresAuth: true } },
  { path: '/choose-shipping', component: () => import('@/views/ChooseShippingPage.vue'), meta: { requiresAuth: true } },
  { path: '/payment-methods', component: () => import('@/views/PaymentMethodsPage.vue'), meta: { requiresAuth: true } },
  { path: '/review-summary', component: () => import('@/views/ReviewSummaryPage.vue'), meta: { requiresAuth: true } },
  { path: '/order-success', component: () => import('@/views/OrderSuccessPage.vue'), meta: { requiresAuth: true } },
  { path: '/orders/:id', component: () => import('@/views/OrderTrackPage.vue'), meta: { requiresAuth: true } },
  { path: '/admin', component: () => import('@/views/AdminDashboardPage.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  await auth.init();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { path: '/signin', query: { redirect: to.fullPath } };
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return '/tabs/home';
  }

  const isAuthScreen = to.path === '/signin' || to.path === '/signup';
  const forceAuthScreen = to.query.force === 'true';

  if (isAuthScreen && auth.isAuthenticated && !forceAuthScreen) {
    return '/tabs/home';
  }

  return true;
});

export default router;
