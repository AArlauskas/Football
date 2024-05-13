<script lang="ts" setup>
import AccountBackground from "@/assets/general/account-background.png";

import SideBar from "./SideBar.vue";
</script>

<template>
  <div class="page-wrapper">
    <div class="page-sidebar">
      <SideBar />
    </div>
    <div class="page-content">
      <slot></slot>
    </div>
  </div>
  <img
    class="account-background"
    :src="AccountBackground"
    alt="Account Background"
  />
</template>

<style lang="scss">
.page-wrapper {
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  padding: 80px 24px 24px 24px;
  gap: 80px;

  .page-sidebar {
    position: sticky;
    top: 80px;
    left: 24px;

    height: calc(100vh - 80px - 24px);
  }

  .page-content {
    width: 100%;
    max-width: 900px;
  }
}

.account-background {
  position: fixed;
  z-index: -1;

  // centered
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 1734px;
  overflow: hidden;
}
</style>
