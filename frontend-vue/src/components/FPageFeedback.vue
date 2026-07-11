<script setup lang="ts">
import { Message } from 'primevue';

import { useTranslations } from '@/composables/useTranslations';

type Props = {
  error?: string;
  success?: string;
};

defineProps<Props>();

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
