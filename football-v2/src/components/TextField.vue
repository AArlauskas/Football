<script lang="ts" setup>
import InputText from "primevue/inputtext";
interface IProps {
  className?: string;
  fullWidth?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  email?: boolean;
}

const props = defineProps<IProps>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  props.onChange(target.value);
};
</script>

<template>
  <div
    class="textfield-wrapper"
    :class="{
      [props.className || '']: props.className,
      'full-width': props.fullWidth,
    }"
  >
    <InputText
      :value="props.value"
      @input="handleChange"
      password
      :placeholder="placeholder"
      :inputmode="email ? 'email' : 'text'"
      :class="{
        'full-width': fullWidth,
      }"
    />
  </div>
</template>

<style lang="scss">
.textfield-wrapper {
  &.full-width {
    width: 100%;

    .p-inputtext {
      width: 100%;
    }
  }
}
</style>
