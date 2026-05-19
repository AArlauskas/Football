import { useI18n } from 'vue-i18n';

import type { TranslationKey } from '@/i18n';

type TranslationParams = Record<string, string | number>;

export const useTranslations = () => {
  const { locale, t: translate } = useI18n({ useScope: 'global' });

  const t = (key: TranslationKey, params?: TranslationParams) =>
    translate(key, params ?? {});

  return {
    locale,
    t,
  };
};
