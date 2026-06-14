<script setup lang="ts">
import Button from 'primevue/button';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import FText from '@/components/FText.vue';
import { RoutePath } from '@/enums';
import type { AppLocale } from '@/i18n';

const props = defineProps<{
  currentPlayerPlace: number | string;
  currentPoints: number | string;
  currentTitle: string;
  isDark: boolean;
  localeOptions: Array<{ label: string; value: AppLocale }>;
  logoSrc: string;
  selectedLocale: AppLocale;
  themeLabel: string;
}>();

const emit = defineEmits<{
  openMenu: [];
  toggleTheme: [];
  'update:selectedLocale': [value: AppLocale];
}>();

const selectedLocaleModel = computed({
  get: () => props.selectedLocale,
  set: (value: AppLocale) => {
    emit('update:selectedLocale', value);
  },
});
</script>

<template>
  <header class="f-page-topbar">
    <div class="f-page-topbar__brand">
      <RouterLink class="f-page-topbar__logo-link" :to="RoutePath.Root">
        <img
          class="f-page-topbar__logo"
          :src="logoSrc"
          :alt="$t('v1.logo.alt')"
        />
      </RouterLink>
    </div>

    <FText as="h1" class="f-page-topbar__title" variant="heading-2">
      {{ currentTitle }}
    </FText>

    <div class="f-page-topbar__actions">
      <div class="f-page-topbar__stats" :aria-label="$t('v1.results')">
        <Tag
          class="f-page-topbar__stat"
          icon="pi pi-trophy"
          :title="$t('v1.place')"
          :value="String(currentPlayerPlace)"
        />
        <Tag
          class="f-page-topbar__stat"
          icon="pi pi-chart-line"
          :title="$t('v1.points')"
          :value="String(currentPoints)"
        />
      </div>

      <Button
        class="f-page-topbar__theme-button"
        :aria-label="themeLabel"
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        rounded
        size="small"
        severity="secondary"
        text
        @click="$emit('toggleTheme')"
      />
      <Button
        class="f-page-topbar__menu-button"
        :aria-label="$t('v1.open.menu')"
        icon="pi pi-bars"
        rounded
        size="small"
        severity="secondary"
        text
        @click="$emit('openMenu')"
      />
      <Select
        v-model="selectedLocaleModel"
        :aria-label="$t('v1.language')"
        :options="localeOptions"
        size="small"
        option-label="label"
        option-value="value"
      />
    </div>
  </header>
</template>

<style scoped lang="scss">
.f-page-topbar {
  position: sticky;
  z-index: 2;
  top: 0;
  display: grid;
  min-height: var(--f-page-empty-topbar-height);
  align-items: center;
  gap: 16px;
  grid-area: topbar;
  grid-template-columns: var(--f-page-empty-sidebar-width) minmax(0, 1fr);
  padding: 10px 24px;
  border-bottom: 1px solid var(--f-page-empty-border);
  background: var(--f-page-empty-panel-background);
  backdrop-filter: blur(16px);
}

.f-page-topbar__brand {
  display: flex;
  align-items: center;
  grid-column: 1;
}

.f-page-topbar__logo-link {
  display: inline-flex;
  align-items: center;
}

.f-page-topbar__logo {
  width: auto;
  height: var(--f-page-empty-logo-height);
  object-fit: contain;
}

.f-page-topbar__title {
  position: absolute;
  top: 50%;
  left: calc(
    var(--f-page-empty-sidebar-width) +
      ((100% - var(--f-page-empty-sidebar-width)) / 2)
  );
  width: max-content;
  max-width: min(42vw, 520px);
  text-align: center;
  transform: translate(-50%, -50%);
}

.f-page-topbar__actions {
  display: flex;
  min-width: 0;
  align-items: center;
  grid-column: 2;
  justify-content: flex-end;
  gap: 10px;
}

.f-page-topbar__stats {
  display: flex;
  align-items: center;
  gap: 6px;
}

.f-page-topbar__stat {
  min-width: 48px;
  justify-content: center;
  padding-inline: 8px;
  white-space: nowrap;
}

.f-page-topbar__menu-button {
  display: none;
}

@media (width <= 920px) {
  .f-page-topbar {
    min-height: var(--f-page-empty-topbar-height);
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 12px;
    padding: 12px 16px;
  }

  .f-page-topbar__brand {
    display: none;
  }

  .f-page-topbar__title {
    position: static;
    overflow: hidden;
    width: auto;
    max-width: 100%;
    grid-column: 2;
    grid-row: 1;
    text-overflow: ellipsis;
    transform: none;
    white-space: nowrap;
  }

  .f-page-topbar__actions {
    display: contents;
  }

  .f-page-topbar__theme-button,
  .f-page-topbar__actions :deep(.p-select) {
    display: none;
  }

  .f-page-topbar__actions > .f-page-topbar__stats {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
  }

  .f-page-topbar__menu-button {
    display: inline-flex;
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
  }
}
</style>
