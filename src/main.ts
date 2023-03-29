import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store";
import i18n from "@/locale/i18n";
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes,
  faAngleRight,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mainState } from "./store/mainState";

library.add(faTimes);
library.add(faAngleRight);
library.add(faAngleDown);

// Vue.directive("focus", {
//   inserted(el) {
//     el.focus();
//   },
// });

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.use(store);
app.use(i18n);
app.use(OpenLayersMap);

app.config.errorHandler = (e) => {
  mainState.setError(true);
  console.error(e);
  return true;
};
window.onerror = (e) => {
  mainState.setError(true);
  console.error(e);
};

app.mount("#app");

// created() {
//   const html = document.documentElement;
//   html.setAttribute('lang', 'fi');
// },

document.title = i18n.t("$siteTitle").toString();
