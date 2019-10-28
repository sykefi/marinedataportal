import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/store';
import i18n from '@/locale/i18n';

Vue.config.productionTip = false;

Vue.directive('focus', {
  inserted(el) {
    el.focus();
  },
});

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');
