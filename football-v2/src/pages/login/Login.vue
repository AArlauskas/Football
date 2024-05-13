<script lang="ts" setup>
import PublicPageWrapper from "@/components/PublicPageWrapper.vue";
import LoginImage from "@/assets/login/login-image.jpg";
import LoginForm from "./login-form/LoginForm.vue";
</script>

<template>
  <PublicPageWrapper className="login-page-wrapper" centered>
    <img :src="LoginImage" alt="Login" class="login-image" />
    <LoginForm />
  </PublicPageWrapper>
</template>

<style lang="scss">
.login-image {
  width: 50%;
  max-width: 800px;
}

@media screen and (max-width: 1024px) {
  .login-page-wrapper {
    .login-image {
      display: none;
    }
  }
}
</style>
