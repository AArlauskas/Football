<script setup lang="ts">
import { Message } from 'primevue';

import { useTranslations } from '@/composables/useTranslations';

defineProps<{
  error?: string;
  success?: string;
}>();

const { t } = useTranslations();
</script>

<template>
  <Message v-if="error" severity="error">
    {{ error || t('v1.general.error') }}
  </Message>
  <Message v-if="success" severity="success">
    {{ success }}
  </Message>
</template>
