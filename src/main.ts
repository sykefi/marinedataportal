import { createApp } from 'vue'
import App from './App.vue'
import i18n from '@/locale/i18n'
import OpenLayersMap from 'vue3-openlayers'
import 'vue3-openlayers/dist/vue3-openlayers.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faAngleRight,
  faAngleDown,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { createPinia } from 'pinia'
import { useMainStateStore } from './stores/mainStateStore'

library.add(faTimes)
library.add(faAngleRight)
library.add(faAngleDown)

const pinia = createPinia()
const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
app.use(pinia)
app.use(i18n)
app.use(OpenLayersMap)

const mainState = useMainStateStore()
app.config.errorHandler = (e) => {
  mainState.setError(true)
  console.error(e)
  return true
}
window.onerror = (e) => {
  mainState.setError(true)
  console.error(e)
}

app.mount('#app')

document.title = i18n.global.t('$siteTitle').toString()
