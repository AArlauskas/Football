import { IntlProvider } from "react-intl";
import React from "react";
import LOCALES from "../../translations/locales";
import lt from "../../translations/lithuanian.json";
import en from "../../translations/english.json";

const TranslationsProvider = ({ locale, children }) => {
  const languages = {
    [LOCALES.ENGLISH]: { ...en },
    [LOCALES.LITHUANIAN]: { ...lt },
  };

  return (
    <IntlProvider locale={locale} messages={languages[locale]}>
      {children}
    </IntlProvider>
  );
};

export default TranslationsProvider;
