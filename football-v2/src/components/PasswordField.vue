<script lang="ts" setup>
import Password from "primevue/password";
import { ref, watch } from "vue";
interface IProps {
  className?: string;
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  feedback?: boolean;
  withToggle?: boolean;
}

const props = defineProps<IProps>();

const valueModel = ref(props.value);

watch(valueModel, (newValue) => {
  props.onChange(newValue);
});
</script>

<template>
  <div
    class="password-wrapper"
    :class="{
      [props.className || '']: props.className,
      'full-width': props.fullWidth,
    }"
  >
    <Password
      v-model="valueModel"
      password
      :placeholder="placeholder"
      :feedback="feedback"
      :toggleMask="withToggle"
      :class="{
        'full-width': fullWidth,
      }"
    />
  </div>
</template>

<style lang="scss">
.password-wrapper {
  &.full-width {
    width: 100%;

    .p-inputtext,
    .p-password {
      width: 100%;
    }
  }
}
</style>
