<script setup lang="ts">
import { Tag } from 'primevue';
import type { TagProps } from 'primevue/tag';
import { computed } from 'vue';

import type { GuessOutcome } from '@/models';
import { GuessOutcome as GuessOutcomeValue } from '@/models/game';

type TagSeverity = TagProps['severity'];
type OutcomeModifier = 'danger' | 'success' | 'warning';

type Props = {
  fallbackSeverity?: TagSeverity;
  outcome: GuessOutcome | null;
  severity?: TagSeverity;
  value: string | number;
};

const props = withDefaults(defineProps<Props>(), {
  fallbackSeverity: 'secondary',
  severity: undefined,
});

const modifier = computed<OutcomeModifier | undefined>(() => {
  if (
    props.outcome === GuessOutcomeValue.CORRECT ||
    props.outcome === GuessOutcomeValue.CORRECT_ALONE
  ) {
    return 'success';
  }

  if (props.outcome === GuessOutcomeValue.OUTCOME_ONLY) {
    return 'warning';
  }

  if (
    props.outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    props.outcome === GuessOutcomeValue.NOT_GIVEN
  ) {
    return 'danger';
  }

  return undefined;
});

const outcomeSeverity = computed<TagSeverity>(() => {
  if (modifier.value === 'warning') {
    return 'warn';
  }

  return modifier.value;
});

const resolvedSeverity = computed(
  () => props.severity ?? outcomeSeverity.value ?? props.fallbackSeverity,
);
</script>

<template>
  <Tag
    class="f-outcome-tag"
    :class="modifier && `f-outcome-tag--${modifier}`"
    :severity="resolvedSeverity"
    :value="value"
  />
</template>

<style scoped lang="scss">
.f-outcome-tag {
  &--success.p-tag {
    background: var(--f-outcome-success-background);
  }

  &--warning.p-tag {
    background: var(--f-outcome-warning-background);
  }

  &--danger.p-tag {
    background: var(--f-outcome-danger-background);
  }
}
</style>
