<script setup lang="ts">
import FBouncingFootball from '@/components/FBouncingFootball.vue';
import FText from '@/components/FText.vue';

defineProps<{
  currentPlayerName: string;
  currentPlayerPlace: number | string;
}>();
</script>

<template>
  <div v-if="currentPlayerName" class="f-page-player-summary">
    <FBouncingFootball class="f-page-player-summary__football" />
    <div class="f-page-player-summary__heading">
      <FText
        as="span"
        class="f-page-player-summary__name"
        variant="body-2-bold"
      >
        {{ currentPlayerName }}
      </FText>
    </div>
    <span class="f-page-player-summary__place">
      <FText as="span" variant="body-3-bold">
        {{ $t('v1.place') }}
      </FText>
      <FText as="span" color="--p-text-muted-color" variant="body-3-bold">
        {{ currentPlayerPlace }}
      </FText>
    </span>
  </div>
</template>

<style scoped lang="scss">
.f-page-player-summary {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--f-space-2xs);
  padding-inline: var(--f-space-sm);

  &__heading {
    display: flex;
    min-width: 0;
    align-items: center;
  }

  &__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__football {
    align-self: flex-start;
    margin-left: 0;
  }

  &__place {
    display: flex;
    align-items: center;
    gap: var(--f-space-2xs);
    white-space: nowrap;
  }
}
</style>
