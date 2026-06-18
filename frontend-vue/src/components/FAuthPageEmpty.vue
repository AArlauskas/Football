<script setup lang="ts">
import { Button, Select } from 'primevue';
import { computed } from 'vue';

import { useTheme } from '@/composables/useTheme';
import { useTranslations } from '@/composables/useTranslations';
import { setLocale, type AppLocale } from '@/i18n';

const { locale, t } = useTranslations();
const { isDark, toggleTheme } = useTheme();

const localeOptions: { label: string; value: AppLocale }[] = [
  { label: 'LT', value: 'lt-LT' },
  { label: 'EN', value: 'en-US' },
  { label: 'MK', value: 'mk-MK' },
];
const themeButtonLabel = computed(() =>
  isDark.value ? t('v1.light.mode') : t('v1.dark.mode'),
);

const selectedLocale = computed({
  get: () => locale.value as AppLocale,
  set: (value: AppLocale) => {
    setLocale(value);
  },
});
</script>

<template>
  <main class="f-page-empty">
    <div class="f-page-empty__actions">
      <Button
        :aria-label="themeButtonLabel"
        :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
        rounded
        severity="secondary"
        variant="outlined"
        text
        @click="toggleTheme"
      />
      <Select
        v-model="selectedLocale"
        :aria-label="t('v1.language')"
        :options="localeOptions"
        option-label="label"
        option-value="value"
      />
    </div>

    <div class="f-page-empty__content">
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.f-page-empty {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: 32px;
}

.f-page-empty__actions {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.f-page-empty__content {
  display: flex;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: 24px;
}

@media (width <= 560px) {
  .f-page-empty {
    padding: 16px;
  }
}
</style>
