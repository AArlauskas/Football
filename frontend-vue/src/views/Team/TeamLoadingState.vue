<script setup lang="ts">
import { Card, Skeleton } from 'primevue';
</script>

<template>
  <Card>
    <template #content>
      <div class="team-loading-state">
        <Skeleton shape="circle" size="5rem" />
        <Skeleton height="2.5rem" width="45%" />
      </div>
    </template>
  </Card>
  <Card>
    <template #content>
      <div class="team-loading-state">
        <Skeleton v-for="index in 4" :key="index" height="4rem" />
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.team-loading-state {
  display: grid;
  justify-items: center;
  gap: var(--f-space-md);
}
</style>
