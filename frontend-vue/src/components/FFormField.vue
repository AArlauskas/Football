<script setup lang="ts">
import FText from '@/components/FText.vue';
import type { FTextVariant } from '@/types';

type FFormFieldProps = {
  error?: string;
  inputId?: string;
  label?: string;
  labelColor?: string;
  labelVariant?: FTextVariant;
};

withDefaults(defineProps<FFormFieldProps>(), {
  error: undefined,
  inputId: undefined,
  label: undefined,
  labelColor: undefined,
  labelVariant: 'body-2-bold',
});
</script>

<template>
  <div class="f-form-field">
    <label v-if="label" class="f-form-field__label" :for="inputId">
      <FText as="span" :color="labelColor" :variant="labelVariant">
        {{ label }}
      </FText>
    </label>

    <slot />

    <small v-if="error">
      <FText as="span" color="--p-red-500" variant="body-3">
        {{ error }}
      </FText>
    </small>
  </div>
</template>

<style scoped lang="scss">
.f-form-field {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: var(--f-space-xs);
}
</style>
