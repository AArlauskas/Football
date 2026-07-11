import type { GuessOutcome } from '@/models';
import { GuessOutcome as GuessOutcomeValue } from '@/models/game';

export const getOutcomeModifierClass = (
  outcome?: GuessOutcome | null,
): string | undefined => {
  if (
    outcome === GuessOutcomeValue.CORRECT ||
    outcome === GuessOutcomeValue.CORRECT_ALONE
  ) {
    return 'f-outcome--success';
  }

  if (outcome === GuessOutcomeValue.OUTCOME_ONLY) {
    return 'f-outcome--warning';
  }

  if (
    outcome === GuessOutcomeValue.OUTCOME_INCORRECT ||
    outcome === GuessOutcomeValue.NOT_GIVEN
  ) {
    return 'f-outcome--danger';
  }

  return undefined;
};
