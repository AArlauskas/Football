<script setup lang="ts">
import { Card } from 'primevue';

import FText from '@/components/FText.vue';

defineProps<{
  number: number;
  text: string;
}>();
</script>

<template>
  <Card class="numbered-rule-card">
    <template #content>
      <div class="numbered-rule-card__content">
        <FText
          as="span"
          class="numbered-rule-card__number"
          color="--p-primary-contrast-color"
          variant="body-2-bold"
        >
          {{ number }}
        </FText>
        <FText as="p" variant="body-2">{{ text }}</FText>
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.numbered-rule-card {
  border: var(--f-card-border);
  height: 100%;

  :deep(.p-card-body) {
    height: 100%;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: var(--f-space-sm);
  }

  &__number {
    display: flex;
    width: 32px;
    height: 32px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    border-radius: var(--f-radius-full);
    background: var(--p-primary-color);
  }
}
</style>
