<script lang="ts" setup>
import TextField from "@/components/TextField.vue";
import PasswordField from "@/components/PasswordField.vue";

import Card from "primevue/card";
import ChampionshipLogo from "@/assets/login/championship-logo.png";
import LeftArrow from "@/assets/arrows/left.svg";
import Button from "@/components/Button.vue";
import { ref } from "vue";
import { router } from "@/services/router/router";

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const onSubmit = (event: Event) => {
  event.preventDefault();
  console.log("submitted");
};

const onGoBack = () => {
  router.back();
};
</script>

<template>
  <Card class="register-card-wrapper">
    <template #header>
      <img :src="LeftArrow" alt="Back" class="back-arrow" @click="onGoBack" />

      <img
        class="championship-logo"
        :src="ChampionshipLogo"
        alt="Championship Logo"
      />
    </template>
    <template #title> {{ $t("REGISTER_TITLE") }} </template>
    <template #content>
      <form class="register-form-wrapper" @submit="onSubmit">
        <TextField
          :placeholder="$t('EMAIL')"
          :value="email"
          @change="(value) => (email = value)"
          fullWidth
          email
        />

        <div class="register-form-row">
          <TextField
            :placeholder="$t('FIRST_NAME')"
            :value="firstName"
            @change="(value) => (firstName = value)"
            fullWidth
          />
          <TextField
            :placeholder="$t('LAST_NAME')"
            :value="lastName"
            @change="(value) => (lastName = value)"
            fullWidth
          />
        </div>

        <div class="register-form-row">
          <PasswordField
            :placeholder="$t('PASSWORD')"
            :value="password"
            @change="(value) => (password = value)"
            fullWidth
            withToggle
          />
          <PasswordField
            :placeholder="$t('CONFIRM_PASSWORD')"
            :value="confirmPassword"
            @change="(value) => (confirmPassword = value)"
            fullWidth
            withToggle
          />
        </div>

        <Button submit centered> {{ $t("REGISTER") }} </Button>
      </form>
    </template>
  </Card>
</template>

<style lang="scss">
.register-card-wrapper {
  width: 100%;
  max-width: 750px;

  .register-form-row {
    display: flex;
    gap: 24px;

    @media screen and (max-width: 768px) {
      flex-direction: column;
    }
  }

  .p-card-header {
    position: relative;
    display: flex;
    justify-content: center;

    .back-arrow {
      position: absolute;
      left: 16px;
      top: 0;
      transform: translateY(50%);
      cursor: pointer;
    }

    .championship-logo {
      width: 100px;
      margin: 0 auto;
    }
  }

  .p-card-title {
    text-align: center;
  }

  .register-form-wrapper {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

@media screen and (max-width: 1024px) {
  .register-card-wrapper {
    max-width: 100%;
  }
}
</style>
