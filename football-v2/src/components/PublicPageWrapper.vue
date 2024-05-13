<script lang="ts" setup>
import BackgroundAsset from "@/assets/general/background-footer.png";
interface IProps {
  className?: string;
  centered?: boolean;
}

defineProps<IProps>();
</script>

<template>
  <div
    class="public-page-wrapper"
    :class="{
      [className || '']: className,
      centered: centered,
    }"
  >
    <slot></slot>
    <img
      class="background-header"
      :src="BackgroundAsset"
      alt="Background Header"
    />
    <img
      class="background-footer"
      :src="BackgroundAsset"
      alt="Background Footer"
    />
  </div>
</template>

<style lang="scss" scoped>
.public-page-wrapper {
  position: relative;
  min-height: 100vh;
  padding: 130px 24px;
  gap: 32px;

  &.centered {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .background-header {
    position: absolute;
    top: 0px;
    right: 0;
    width: 300px;
    transform: scaleX(-1);
    overflow: hidden;
  }

  .background-footer {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 300px;
    overflow: hidden;
  }

  @media screen and (max-width: 1024px) {
    .background-header,
    .background-footer {
      width: 200px;
    }
  }
}
</style>
