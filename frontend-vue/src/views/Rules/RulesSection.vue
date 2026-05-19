<script setup lang="ts">
import { Card, Divider } from 'primevue';

import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import NumberedRuleCard from '@/views/Rules/NumberedRuleCard.vue';

withDefaults(
  defineProps<{
    isWrapped?: boolean;
    rules: TranslationKey[];
    title: TranslationKey;
  }>(),
  {
    isWrapped: false,
  },
);

const { t } = useTranslations();
</script>

<template>
  <Card class="rules-section">
    <template #title>{{ t(title) }}</template>
    <template #content>
      <div class="rules-section__content">
        <Divider />
        <div
          class="rules-section__list"
          :class="{ 'rules-section__list--wrapped': isWrapped }"
        >
          <NumberedRuleCard
            v-for="(rule, index) in rules"
            :key="rule"
            :number="index + 1"
            :text="t(rule)"
            class="rules-section__item"
          />
        </div>
      </div>
    </template>
  </Card>
</template>

<style scoped lang="scss">
.rules-section {
  overflow: hidden;

  &__content,
  &__list {
    display: flex;
    flex-direction: column;
  }

  &__content {
    gap: 8px;
  }

  &__list {
    gap: 12px;
  }

  &__list--wrapped {
    flex-flow: row wrap;
    gap: 16px;
  }

  &__list--wrapped .rules-section__item {
    flex: 1 1 calc(50% - 8px);
  }
}

@media (width <= 760px) {
  .rules-section__list--wrapped .rules-section__item {
    flex-basis: 100%;
  }
}
</style>
