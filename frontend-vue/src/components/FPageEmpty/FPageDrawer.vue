<script setup lang="ts">
import Button from 'primevue/button';
import Drawer from 'primevue/drawer';
import Select from 'primevue/select';
import { computed } from 'vue';

import FPageNavigation from '@/components/FPageEmpty/FPageNavigation.vue';
import FPagePlayerSummary from '@/components/FPageEmpty/FPagePlayerSummary.vue';
import type { RouteName, RoutePath } from '@/enums';
import type { AppLocale, TranslationKey } from '@/i18n';

type NavigationItem = {
  icon: string;
  label: TranslationKey;
  name: (typeof RouteName)[keyof typeof RouteName];
  path: (typeof RoutePath)[keyof typeof RoutePath];
};

const props = defineProps<{
  currentPlayerName: string;
  currentPlayerPlace: number | string;
  isDark: boolean;
  localeOptions: Array<{ label: string; value: AppLocale }>;
  navigationItems: NavigationItem[];
  selectedLocale: AppLocale;
  themeLabel: string;
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  signOut: [];
  toggleTheme: [];
  'update:selectedLocale': [value: AppLocale];
  'update:visible': [value: boolean];
}>();

const selectedLocaleModel = computed({
  get: () => props.selectedLocale,
  set: (value: AppLocale) => {
    emit('update:selectedLocale', value);
  },
});

const visibleModel = computed({
  get: () => props.visible,
  set: (value: boolean) => {
    emit('update:visible', value);
  },
});
</script>

<template>
  <Drawer v-model:visible="visibleModel" :header="$t('v1.navigation')">
    <div
      class="f-page-drawer__content"
      data-football-container="true"
      :class="{ 'f-page-drawer__content--dark': isDark }"
    >
      <div class="f-page-drawer__actions">
        <FPagePlayerSummary
          :current-player-name="currentPlayerName"
          :current-player-place="currentPlayerPlace"
        />
      </div>

      <FPageNavigation :items="navigationItems" @navigate="$emit('close')" />

      <div class="f-page-drawer__footer">
        <div class="f-page-drawer__settings">
          <Select
            v-model="selectedLocaleModel"
            :aria-label="$t('v1.language')"
            :options="localeOptions"
            option-label="label"
            option-value="value"
          />
          <Button
            :aria-label="themeLabel"
            :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
            rounded
            severity="secondary"
            text
            @click="$emit('toggleTheme')"
          />
        </div>

        <Button
          class="f-page-drawer__sign-out"
          icon="pi pi-sign-out"
          :label="$t('v1.log.out')"
          severity="secondary"
          outlined
          @click="$emit('signOut')"
        />
      </div>
    </div>
  </Drawer>
</template>

<style scoped lang="scss">
.f-page-drawer__content {
  --f-page-empty-border: var(--p-surface-200);
  --f-page-empty-nav-active-background: color-mix(
    in srgb,
    var(--p-primary-100) 92%,
    transparent
  );
  --f-page-empty-nav-active-color: var(--p-primary-700);

  display: flex;
  min-height: 100%;
  position: relative;
  flex-direction: column;
  gap: 10px;
}

.f-page-drawer__content--dark {
  --f-page-empty-border: var(--p-surface-800);
  --f-page-empty-nav-active-background: color-mix(
    in srgb,
    var(--p-primary-500) 22%,
    transparent
  );
  --f-page-empty-nav-active-color: var(--p-primary-200);
}

.f-page-drawer__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  margin-bottom: 6px;
  border-bottom: 1px solid var(--f-page-empty-border);
}

.f-page-drawer__footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  margin-top: auto;
  border-top: 1px solid var(--f-page-empty-border);
}

.f-page-drawer__settings {
  display: flex;
  align-items: center;
  gap: 12px;
}

.f-page-drawer__settings :deep(.p-select) {
  flex: 1;
}
</style>
