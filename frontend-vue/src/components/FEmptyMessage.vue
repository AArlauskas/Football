<script setup lang="ts">
import { Message } from 'primevue';

import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';

type Props = {
  message: TranslationKey;
};

defineProps<Props>();

const { t } = useTranslations();
</script>

<template>
  <Message severity="info">
    {{ t(message) }}
  </Message>
</template>
