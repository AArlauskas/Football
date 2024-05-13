import { Languages } from "@/constants/languages";
import englishLocale from "./locale/english.json";
import lithuanianLocale from "./locale/lithuanian.json";

import { createI18n } from "vue-i18n";

export const languagesMapping = {
  [Languages.EN]: englishLocale,
  [Languages.LT]: lithuanianLocale,
};

const messages = Object.assign(languagesMapping);

const i18n = createI18n({
  legacy: true,
  locale: Languages.LT,
  fallbackLocale: Languages.EN,
  messages,
});

const t = (key: string): string => {
  return i18n.global.t(key).toString();
};

export { i18n, t };
