import Vue from 'vue';
import VueI18n, { DateTimeFormats } from 'vue-i18n';
import fi from './fi/fi';
import en from './en/en';
import sv from './sv/sv';

Vue.use(VueI18n);
const browserLang = navigator.language.toLocaleLowerCase();
const locale = browserLang.startsWith('fi') ? 'fi' : browserLang.startsWith('sv') ? 'sv' : 'en';

const dateTimeFormats: DateTimeFormats = {
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
export default new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages,
  dateTimeFormats,
});
