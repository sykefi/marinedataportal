import Vue from 'vue';
import VueI18n from 'vue-i18n';
import fi from './fi/fi';

Vue.use(VueI18n);
// const browserLang = navigator.language.toLocaleLowerCase();

const dateTimeFormats = {
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
};

const messages = { fi };

export default new VueI18n({
  locale: 'fi', // set locale,
  fallbackLocale: 'fi',
  messages,
  dateTimeFormats,
});
