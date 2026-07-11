<script setup lang="ts">
import { Skeleton } from 'primevue';

const rows = 8;
</script>

<template>
  <div class="results-table-skeleton" aria-hidden="true">
    <Skeleton height="42px" />
    <Skeleton v-for="row in rows" :key="row" height="48px" />
  </div>
</template>

<style scoped lang="scss">
.results-table-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--f-space-xs);
}
</style>
