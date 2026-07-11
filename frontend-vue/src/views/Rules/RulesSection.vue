<script setup lang="ts">
import { Card, Divider } from 'primevue';

import FText from '@/components/FText.vue';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import NumberedRuleCard from '@/views/Rules/NumberedRuleCard.vue';

type Props = {
  isWrapped?: boolean;
  rules: TranslationKey[];
  title: TranslationKey;
};

withDefaults(defineProps<Props>(), {
  isWrapped: false,
});

const { t } = useTranslations();
</script>

<template>
  <Card class="rules-section">
    <template #title>
      <FText as="h2" variant="heading-3">{{ t(title) }}</FText>
    </template>
    <template #content>
      <div class="rules-section__content">
        <Divider class="rules-section__divider" />
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
    gap: var(--f-space-md);
  }

  &__list {
    gap: var(--f-space-md);
  }

  &__divider {
    margin: 0;
  }

  &__list--wrapped {
    display: grid;
    align-items: stretch;
    gap: var(--f-space-md);
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &__list--wrapped .rules-section__item {
    min-width: 0;
    height: 100%;
  }
}

@media (width <= 760px) {
  .rules-section__list--wrapped {
    grid-template-columns: 1fr;
  }
}
</style>
