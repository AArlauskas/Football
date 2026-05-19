<script setup lang="ts">
import Toast from 'primevue/toast';
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';

import FPageEmpty from '@/components/FPageEmpty/FPageEmpty.vue';

const route = useRoute();

const usesPageLayout = computed(() => route.meta.requiresAuth === true);
</script>

<template>
  <Toast />
  <FPageEmpty v-if="usesPageLayout">
    <RouterView />
  </FPageEmpty>
  <RouterView v-else />
</template>
