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
  <Drawer
    v-model:visible="visibleModel"
    class="f-page-drawer"
    :header="$t('v1.navigation')"
  >
    <div class="f-page-drawer__content" data-football-container="true">
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
.f-page-drawer {
  &__content {
    display: flex;
    min-height: 100%;
    position: relative;
    flex-direction: column;
    gap: var(--f-space-sm);
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-md);
    padding-bottom: var(--f-space-md);
    margin-bottom: var(--f-space-2xs);
    border-bottom: 1px solid var(--f-page-empty-border);
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: var(--f-space-md);
    padding-top: var(--f-space-md);
    margin-top: auto;
    border-top: 1px solid var(--f-page-empty-border);
  }

  &__settings {
    display: flex;
    align-items: center;
    gap: var(--f-space-md);

    :deep(.p-select) {
      flex: 1;
    }
  }
}
</style>
