<script setup lang="ts">
import { computed } from 'vue';

import { usePageTitle } from '@/composables/usePageTitle';
import { useTranslations } from '@/composables/useTranslations';
import type { TranslationKey } from '@/i18n';
import RulesSection from '@/views/Rules/RulesSection.vue';

const { t } = useTranslations();

const generalRules: TranslationKey[] = [
  'v1.rule.submit.before.kickoff',
  'v1.rule.predictions.visible.after.kickoff',
  'v1.rule.playoffs.no.draws',
];
const calculationRules: TranslationKey[] = [
  'v1.rule.correct.exact.score',
  'v1.rule.unique.exact.score',
  'v1.rule.unique.match.outcome',
  'v1.rule.correct.match.outcome',
  'v1.rule.incorrect.match.outcome',
  'v1.rule.incorrect.goal',
  'v1.rule.missing.prediction',
  'v1.rule.ranking.tiebreaker',
];
const exampleRules: TranslationKey[] = [
  'v1.rule.example.match.result',
  'v1.rule.example.exact.score',
  'v1.rule.example.incorrect.goals',
  'v1.rule.example.predicted.draw',
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
