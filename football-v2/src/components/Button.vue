<script lang="ts" setup>
import Button from "primevue/button";

interface IProps {
  className?: string;
  onClick?: () => void;
  severity?:
    | "primary"
    | "secondary"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "text";
  link?: boolean;
  centered?: boolean;
  submit?: boolean;
}

defineProps<IProps>();
</script>

<template>
  <Button
    class="button-wrapper"
    :class="{
      [className || '']: className,
      centered: centered,
    }"
    :severity="severity"
    @click="onClick"
    :link="link"
    :type="submit ? 'submit' : 'button'"
  >
    <slot></slot>
  </Button>
</template>

<style lang="scss">
.button-wrapper.centered {
  justify-content: center;
}
</style>
