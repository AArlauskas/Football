import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import '@fontsource-variable/inter/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css';
import { createApp } from 'vue';

import App from '@/App.vue';
import { initializeTheme } from '@/composables/useTheme';
import { i18n } from '@/i18n';
import { router } from '@/router';
import '@/style.css';

const pinia = createPinia();

pinia.use(piniaPluginPersistedstate);
initializeTheme();

const CustomColorsPreset = definePreset(Aura, {
  primitive: {
    green: {
      50: '{pink.50}',
      100: '{pink.100}',
      200: '{pink.200}',
      300: '{pink.300}',
      400: '{pink.400}',
      500: '{pink.500}',
      600: '{pink.600}',
      700: '{pink.700}',
      800: '{pink.800}',
      900: '{pink.900}',
      950: '{pink.950}',
    },
  },
  semantic: {
    primary: {
      50: '{pink.50}',
      100: '{pink.100}',
      200: '{pink.200}',
      300: '{pink.300}',
      400: '{pink.400}',
      500: '{pink.500}',
      600: '{pink.600}',
      700: '{pink.700}',
      800: '{pink.800}',
      900: '{pink.900}',
      950: '{pink.950}',
    },
  },
});

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(ToastService)
  .use(PrimeVue, {
    theme: {
      preset: CustomColorsPreset,
      options: {
        darkModeSelector: '.app-dark',
      },
    },
    pt: {
      card: {
        body: {
          style: 'padding: 1.25rem 1rem; gap: var(--f-space-md);',
        },
      },
      toast: {
        root: {
          style: 'max-width: calc(100vw - 40px);',
        },
      },
      drawer: {
        root: {
          style: 'border: none;',
        },
      },
    },
  })
  .mount('#app');
