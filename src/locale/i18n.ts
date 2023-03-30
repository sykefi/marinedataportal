import { createI18n, I18nOptions } from 'vue-i18n';
import fi from './fi/fi';
import en from './en/en';
import sv from './sv/sv';

const browserLang = navigator.language.toLocaleLowerCase();
const locale = browserLang.startsWith('fi')
  ? 'fi'
  : browserLang.startsWith('sv')
  ? 'sv'
  : 'en';

const dateTimeFormats: I18nOptions['datetimeFormats'] = {
  en: {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    },
  },
  fi: {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  sv: {
    short: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
    long: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
};

const messages = { en, fi, sv };
export default createI18n({
  locale,
  fallbackLocale: 'en',
  messages,
  dateTimeFormats,
  warnHtmlInMessage: 'warn',
});
