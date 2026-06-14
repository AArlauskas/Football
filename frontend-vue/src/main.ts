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

createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(ToastService)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.app-dark',
      },
    },
    pt: {
      toast: {
        root: {
          style: 'max-width: calc(100vw - 40px);',
        },
      },
    },
  })
  .mount('#app');
