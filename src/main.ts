import Vue from 'vue';
import App from './App.vue';
import store from './store/store';
import i18n from '@/locale/i18n';
import VueLayers from 'vuelayers';
import 'vuelayers/lib/style.css';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(faTimes);
library.add(faAngleRight);

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.use(VueLayers);

Vue.config.productionTip = true;

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

new Vue({
  created() {
    const html = document.documentElement;
    html.setAttribute('lang', 'fi');
  },
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

document.title = i18n.t('$siteTitle').toString();
