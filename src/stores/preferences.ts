import { defineStore } from 'pinia';

export type AppLanguage = 'en' | 'es';

export type UserAddress = {
  country: string;
  city: string;
  address: string;
};

const LANGUAGE_KEY = 'autovalor_language';
const ADDRESS_KEY_PREFIX = 'autovalor_address_';

function userAddressKey(userId?: number | string | null) {
  return `${ADDRESS_KEY_PREFIX}${userId || 'guest'}`;
}

function readLanguage(): AppLanguage {
  const value = window.localStorage.getItem(LANGUAGE_KEY);
  return value === 'es' ? 'es' : 'en';
}

function readAddress(userId?: number | string | null): UserAddress {
  try {
    const raw = window.localStorage.getItem(userAddressKey(userId));
    if (!raw) return { country: '', city: '', address: '' };
    return { country: '', city: '', address: '', ...JSON.parse(raw) };
  } catch {
    return { country: '', city: '', address: '' };
  }
}

function writeAddress(userId: number | string | null | undefined, address: UserAddress) {
  window.localStorage.setItem(userAddressKey(userId), JSON.stringify(address));
}

const translations = {
  en: {
    profileTitle: 'My Profile',
    editProfile: 'Edit Profile',
    listings: 'Listings',
    address: 'Address',
    notification: 'Notification',
    payment: 'Payment',
    security: 'Security',
    language: 'Language',
    darkMode: 'Dark Mode',
    privacyPolicy: 'Privacy Policy',
    helpCenter: 'Help Center',
    inviteFriends: 'Invite Friends',
    logout: 'Logout',
    loggingOut: 'Logging out...',
    maintenanceTitle: 'Service under maintenance',
    maintenanceMessage: '{section} is under maintenance. This feature will be available soon.',
    understood: 'Got it',
    languageTitle: 'Language',
    languageSubtitle: 'Choose the language used in AutoValor.',
    english: 'English (US)',
    spanish: 'Spanish',
    saved: 'Saved',
    addressTitle: 'Address',
    addressSubtitle: 'Save your city and country so buyers can see the approximate seller location.',
    country: 'Country',
    city: 'City',
    streetAddress: 'Address',
    countryPlaceholder: 'Spain',
    cityPlaceholder: 'Barcelona',
    addressPlaceholder: 'Street, number, postal code...',
    saveAddress: 'Save address',
    addressSaved: 'Address saved successfully.',
    home: 'Home',
    orders: 'Orders',
    sell: 'Sell',
    message: 'Message',
    profile: 'Profile',
  },
  es: {
    profileTitle: 'Mi perfil',
    editProfile: 'Editar perfil',
    listings: 'Anuncios',
    address: 'Dirección',
    notification: 'Notificaciones',
    payment: 'Pago',
    security: 'Seguridad',
    language: 'Idioma',
    darkMode: 'Modo oscuro',
    privacyPolicy: 'Política de privacidad',
    helpCenter: 'Centro de ayuda',
    inviteFriends: 'Invitar amigos',
    logout: 'Cerrar sesión',
    loggingOut: 'Cerrando sesión...',
    maintenanceTitle: 'Servicio en mantenimiento',
    maintenanceMessage: '{section} está en mantenimiento. Esta funcionalidad estará disponible próximamente.',
    understood: 'Entendido',
    languageTitle: 'Idioma',
    languageSubtitle: 'Elige el idioma que se usará en AutoValor.',
    english: 'Inglés (US)',
    spanish: 'Español',
    saved: 'Guardado',
    addressTitle: 'Dirección',
    addressSubtitle: 'Guarda tu ciudad y país para que los compradores vean la ubicación aproximada del vendedor.',
    country: 'País',
    city: 'Ciudad',
    streetAddress: 'Dirección',
    countryPlaceholder: 'España',
    cityPlaceholder: 'Barcelona',
    addressPlaceholder: 'Calle, número, código postal...',
    saveAddress: 'Guardar dirección',
    addressSaved: 'Dirección guardada correctamente.',
    home: 'Inicio',
    orders: 'Pedidos',
    sell: 'Vender',
    message: 'Mensajes',
    profile: 'Perfil',
  },
} as const;

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    language: readLanguage() as AppLanguage,
    address: { country: '', city: '', address: '' } as UserAddress,
  }),

  getters: {
    languageLabel: (state) => state.language === 'es' ? translations.es.spanish : translations.en.english,
  },

  actions: {
    init(userId?: number | string | null) {
      this.language = readLanguage();
      this.address = readAddress(userId);
      document.documentElement.lang = this.language;
    },

    setLanguage(language: AppLanguage) {
      this.language = language;
      window.localStorage.setItem(LANGUAGE_KEY, language);
      document.documentElement.lang = language;
    },

    setAddress(userId: number | string | null | undefined, address: UserAddress) {
      this.address = address;
      writeAddress(userId, address);
    },

    t(key: keyof typeof translations.en, values?: Record<string, string>) {
      let text: string = translations[this.language][key] || translations.en[key] || key;
      if (values) {
        Object.entries(values).forEach(([name, value]) => {
          text = text.replace(`{${name}}`, value);
        });
      }
      return text;
    },
  },
});
