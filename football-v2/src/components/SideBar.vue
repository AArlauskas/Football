<script lang="ts" setup>
import Card from "primevue/card";
import PointsBadge from "@/components/PointsBadge.vue";
import ChampionshipLogo from "@/assets/login/championship-logo.png";
import { getPrivateRoutes } from "@/constants/routes";

const privateRoutes = getPrivateRoutes();
</script>

<template>
  <div class="page-sidebar-wrapper">
    <Card class="page-sidebar-card">
      <template #header>
        <img
          class="championship-logo"
          :src="ChampionshipLogo"
          alt="Championship Logo"
        />
      </template>
      <template #title>
        <PointsBadge />
        <div class="sidebar-user-name">Aurimas Arlauskas</div>
      </template>
      <template #content>
        <div
          v-for="route in privateRoutes"
          :key="route.path"
          class="sidebar-route"
        >
          <img :src="route.icon" alt="icon" class="sidebar-route-icon" />
          <div class="sidebar-route-title">{{ route.title }}</div>
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
.page-sidebar-wrapper {
  height: 100%;
  .page-sidebar-card {
    height: 100%;
    min-width: 300px;
    justify-content: start;
    background: #ffffff80;
    backdrop-filter: blur(20px);

    .p-card-header {
      display: flex;
      justify-content: center;
      align-items: center;

      .championship-logo {
        width: 100px;
        margin: 0 auto;
      }
    }

    .p-card-title {
      display: flex;
      align-items: center;
      flex-direction: column;
      gap: 8px;

      border-top: 1px solid gray;
      border-bottom: 1px solid gray;
      padding: 12px 0;
    }

    .p-card-content {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sidebar-route {
      display: flex;
      gap: 8px;
      padding: 8px 0;
      cursor: pointer;
      align-items: center;
    }
  }
}
</style>
