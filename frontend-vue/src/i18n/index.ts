import { createI18n } from 'vue-i18n';

import { messages } from '@/i18n/messages';
import type { AppLocale, TranslationKey } from '@/i18n/messages';

const DEFAULT_LOCALE: AppLocale = 'lt-LT';
const LOCALE_STORAGE_KEY = 'language';

const isAppLocale = (locale: string | null): locale is AppLocale =>
  locale !== null && locale in messages;

const getInitialLocale = (): AppLocale => {
  const storedLocale = window.sessionStorage.getItem(LOCALE_STORAGE_KEY);

  return isAppLocale(storedLocale) ? storedLocale : DEFAULT_LOCALE;
};

export const i18n = createI18n({
  fallbackLocale: 'en-US',
  legacy: false,
  locale: getInitialLocale(),
  messages,
});

export const setLocale = (locale: AppLocale) => {
  i18n.global.locale.value = locale;
  window.sessionStorage.setItem(LOCALE_STORAGE_KEY, locale);
};

export { DEFAULT_LOCALE };
export type { AppLocale, TranslationKey };
