<template>
  <div id="app">
    <div id="app-container">
      <AppHeader id="site-header" />
      <SiteImage id="site-image" />
      <SiteTitle id="site-title" />
      <InfoMenu id="info-menu" />
      <div id="content">
        <ErrorMessages />
        <AttributeSelection />
        <TimeSpanSelection />
        <SiteSelection />
        <DataDownload />
        <DataPreview />
      </div>
      <AppFooter id="footer" />
      <div id="busy-indicator" v-if="loading">
        <div class="spinner">
          <div class="double-bounce1" />
          <div class="double-bounce2" />
        </div>
        {{ $t('$busy') }}
      </div>
      <div v-if="hasError" class="error-notification">
        {{ $t('$errorNotification') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue'
import TimeSpanSelection from '@/components/TimeSpanSelection.vue'
import SiteSelection from '@/components/siteSelection/SiteSelection.vue'
import DataDownload from '@/components/DataDownload.vue'
import DataPreview from '@/components/dataPreview/DataPreview.vue'
import AppHeader from '@/components/AppHeader.vue'
import InfoMenu from '@/components/InfoMenu.vue'
import AppFooter from '@/components/AppFooter.vue'
import SiteTitle from '@/components/SiteTitle.vue'
import SiteImage from '@/components/SiteImage.vue'
import ErrorMessages from '@/components/ErrorMessages.vue'
import { getMareographs } from '@/queries/FMI/getMareographsQuery'
import { getBuoys } from '@/queries/FMI/getBuoysQuery'
import { sykeApiIsOnline } from './queries/Vesla/getApiStatusQuery'
import { fmiApiIsOnline } from './queries/FMI/getApiStatusQuery'
import { defineComponent } from 'vue'
import { useMainStateStore } from './stores/mainStateStore'
import { useSurgeStore } from './stores/surgeStore'
import { useSurfaceTemperatureStore } from './stores/surfaceTemperatureStore'
import { useMapStore } from './stores/mapStore'

export default defineComponent({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    DataDownload,
    DataPreview,
    AppHeader,
    InfoMenu,
    AppFooter,
    SiteTitle,
    SiteImage,
    ErrorMessages,
  },
  computed: {
    hasError() {
      const mainState = useMainStateStore()
      return mainState.hasError
    },
    loading() {
      const mainState = useMainStateStore()
      return mainState.loading
    },
  },
  async mounted() {
    const mainState = useMainStateStore()
    const surgeStore = useSurgeStore()
    const surfaceTemperatureStore = useSurfaceTemperatureStore()
    const mapStore = useMapStore()

    const sykeIsOnline = await sykeApiIsOnline()
    mainState.setSykeApiOnlineStatus(sykeIsOnline)
    const fmiIsOnline = await fmiApiIsOnline()
    mainState.setFmiApiOnlineStatus(fmiIsOnline)

    if (fmiIsOnline) {
      getMareographs()
      getBuoys()
    }
    if (sykeIsOnline) {
      mainState.populateSelectionOptions()
    } else {
      // If syke api is not responding, do not try to fetch water quality options
      surgeStore.getOptions()
      surfaceTemperatureStore.getOptions()
    }

    mapStore.generateMapOptions()
  },
})
</script>

<style lang="scss">
//global styles
@import '@/assets/styles/font_faces.scss';
@import '@/assets/styles/variables.scss';
#app * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app-container {
  display: grid;
  font-family: 'TitilliumWeb', sans-serif;
  text-align: center;
  grid-template:
    'head head head'
    'pict pict pict'
    'info info info'
    '. cont .'
    'foot foot foot'
    / auto $content-width auto;
}

body {
  margin: 0;
}

#site-header {
  grid-area: head;
}

#site-image {
  grid-area: pict;
  height: 100%;
}

#site-title {
  grid-area: pict;
}

#info-menu {
  grid-area: info;
}

#content {
  grid-area: cont;
}

#footer {
  grid-area: foot;
}

.hidden {
  display: none;
}

#busy-indicator {
  position: fixed;
  bottom: 10%;
  left: 0;
  right: 0;
  margin: 0 auto;
  line-height: 3rem;
  width: 12rem;
  border: 0.08rem solid $border-dark;
  border-radius: 1.2rem;
  text-align: center;
  color: $border-dark;
  background: white;
  z-index: 999;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  position: relative;
  vertical-align: middle;
  display: inline-block;
}

.double-bounce1,
.double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: $background-blue;
  opacity: 0.7;
  position: absolute;
  top: 0;
  left: 0;

  -webkit-animation: sk-bounce 2s infinite ease-in-out;
  animation: sk-bounce 2s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1s;
  animation-delay: -1s;
}

@-webkit-keyframes sk-bounce {
  0%,
  100% {
    -webkit-transform: scale(0);
  }
  50% {
    -webkit-transform: scale(1);
  }
}

@keyframes sk-bounce {
  0%,
  100% {
    transform: scale(0);
    -webkit-transform: scale(0);
  }
  50% {
    transform: scale(1);
    -webkit-transform: scale(1);
  }
}
</style>
