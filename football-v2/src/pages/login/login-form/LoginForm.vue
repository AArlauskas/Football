<script lang="ts" setup>
import TextField from "@/components/TextField.vue";
import PasswordField from "@/components/PasswordField.vue";

import Card from "primevue/card";
import ChampionshipLogo from "@/assets/login/championship-logo.png";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import { router } from "@/services/router/router";
import { RoutePaths } from "@/constants/routes";

const email = ref("");
const password = ref("");

const onRegisterClick = () => {
  router.push(RoutePaths.REGISTER);
};
</script>

<template>
  <Card class="login-card-wrapper">
    <template #header>
      <img
        class="championship-logo"
        :src="ChampionshipLogo"
        alt="Championship Logo"
      />
    </template>
    <template #title> {{ $t("LOG_IN") }} </template>
    <template #content>
      <div class="login-form-wrapper">
        <TextField
          :placeholder="$t('EMAIL')"
          :value="email"
          @change="(value) => (email = value)"
          fullWidth
          email
        />
        <PasswordField
          :placeholder="$t('PASSWORD')"
          :value="password"
          @change="(value) => (password = value)"
          fullWidth
          withToggle
        />

        <Button @click="console.log('clicked')" centered>
          {{ $t("LOG_IN") }}
        </Button>
        <Button link @click="onRegisterClick">
          {{ $t("REGISTER_PROMPT") }}
        </Button>
      </div>
    </template>
  </Card>
</template>

<style lang="scss">
.login-card-wrapper {
  width: 100%;
  max-width: 550px;
  .p-card-header {
    display: flex;
    justify-content: center;

    .championship-logo {
      width: 100px;
      margin: 0 auto;
    }
  }

  .p-card-title {
    text-align: center;
  }

  .login-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

@media screen and (max-width: 1024px) {
  .login-card-wrapper {
    max-width: 100%;
  }
}
</style>
