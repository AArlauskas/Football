<script setup lang="ts">
import { computed } from 'vue';

import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import RulesSection from '@/views/Rules/RulesSection.vue';

const { t } = useTranslations();

const generalRules: TranslationKey[] = ['v1.rule.1', 'v1.rule.2'];
const calculationRules: TranslationKey[] = [
  'v1.rule.3',
  'v1.rule.4',
  'v1.rule.5',
  'v1.rule.6',
  'v1.rule.7',
  'v1.rule.8',
  'v1.rule.9',
  'v1.rule.10',
];
const exampleRules: TranslationKey[] = [
  'v1.rule.11',
  'v1.rule.12',
  'v1.rule.13',
  'v1.rule.14',
];

usePageTitle(computed(() => t('v1.rules')));
</script>

<template>
  <main class="rules">
    <RulesSection :rules="generalRules" title="v1.points" />
    <RulesSection :rules="calculationRules" title="v1.calculation.of.points" />
    <RulesSection
      :rules="exampleRules"
      title="v1.example.of.scoring"
      is-wrapped
    />
  </main>
</template>

<style scoped lang="scss">
.rules {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
