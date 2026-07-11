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
  <main class="f-auth-page-empty">
    <div class="f-auth-page-empty__actions">
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

    <div class="f-auth-page-empty__content">
      <slot />
    </div>
  </main>
</template>

<style scoped lang="scss">
.f-auth-page-empty {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  padding: calc(var(--f-space-md) * 2);

  &__actions {
    display: flex;
    width: 100%;
    align-items: center;
    gap: var(--f-space-xs);
    justify-content: flex-end;
  }

  &__content {
    display: flex;
    width: 100%;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-top: var(--f-space-xl);
  }
}

@media (width <= 560px) {
  .f-auth-page-empty {
    padding: var(--f-space-md);
  }
}
</style>
