import { createApp } from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-teal/theme.css";
import { router } from "./services/router/router";
import { i18n } from "./services/localization/localization";

const app = createApp(App);
app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(i18n);

app.mount("#app");
