<script setup lang="ts">
import { Card, Skeleton } from 'primevue';
</script>

<template>
  <Card>
    <template #content>
      <div class="player-loading-state">
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="5rem" />
      </div>
    </template>
  </Card>
  <Card>
    <template #content>
      <div class="player-loading-state">
        <Skeleton v-for="index in 4" :key="index" height="4rem" />
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.player-loading-state {
  display: grid;
  gap: var(--f-space-md);
}
</style>
