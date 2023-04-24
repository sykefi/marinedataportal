<template>
  <header>
    <div id="upper-header">
      <!-- Finnish -->
      <div id="project-logo" v-if="$i18n.locale === 'fi'">
        <a target="_blank" rel="noopener" href="https://www.itameri.fi/fi-FI">
          <img
            src="@/assets/logos/Hankelogo_fi_en.png"
            alt="Itämeri.fi kotisivu."
          />
        </a>
      </div>

      <!-- Swedish -->
      <div id="project-logo" v-if="$i18n.locale === 'sv'">
        <a target="_blank" rel="noopener" href="https://www.ostersjon.fi/sv-FI">
          <img
            src="@/assets/logos/Hankelogo_fi_en.png"
            alt="Itämeri.fi hemsida."
          />
        </a>
      </div>

      <!-- English -->
      <div id="project-logo" v-if="$i18n.locale === 'en'">
        <a target="_blank" rel="noopener" href="https://www.itameri.fi">
          <img
            src="@/assets/logos/Hankelogo_fi_en.png"
            alt="Itämeri.fi home."
          />
        </a>
      </div>

      <div id="lang-and-logos">
        <a
          href="#"
          :class="{ current: $i18n.locale === 'fi' }"
          @click="setLanguage('fi')"
          aria-label="Vaihda kieleksi suomi."
          id="fi-link"
        >
          FI
        </a>
        <a
          href="#"
          :class="{ current: $i18n.locale === 'sv' }"
          @click="setLanguage('sv')"
          aria-label="Ändra språk till svenska."
          id="sv-link"
        >
          SV
        </a>
        <a
          href="#"
          :class="{ current: $i18n.locale === 'en' }"
          @click="setLanguage('en')"
          aria-label="Change language to English."
          id="en-link"
        >
          EN
        </a>

        <!-- Finnish -->
        <div id="fund-logos" v-if="$i18n.locale === 'fi'">
          <img
            src="@/assets/logos/emkr_fi.png"
            alt="Logo Euroopan meri- ja kalatalousrahasto, Suomen toimintaohjelma 2014-2020."
          />
          <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
        </div>

        <!-- Swedish -->
        <div id="fund-logos" v-if="$i18n.locale === 'sv'">
          <img
            src="@/assets/logos/emkr_sve.png"
            alt="Logo Europeiska havs- och fiskerifonden, Finlands operativa program 2014-2020."
          />
          <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
        </div>

        <!-- English -->
        <div id="fund-logos" v-if="$i18n.locale === 'en'">
          <img
            src="@/assets/logos/emkr_eng.jpg"
            alt="Logo of the European maritime and fisheries fund, operational programme for Finland 2014-2020."
          />
          <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import i18n from '@/locale/i18n'
import { useSurfaceTemperatureStore } from '@/stores/surfaceTemperatureStore'
import { useSurgeStore } from '@/stores/surgeStore'
import { useWaterQualityStore } from '@/stores/waterQualityStore'
import { defineComponent } from 'vue'

type ILangTag = 'fi' | 'sv' | 'en'

export default defineComponent({
  methods: {
    setLanguage(tag: ILangTag) {
      const surfaceTemperatureStore = useSurfaceTemperatureStore()
      const surgeStore = useSurgeStore()
      const waterQualityStore = useWaterQualityStore()

      i18n.global.locale = tag
      const html = document.documentElement
      html.setAttribute('lang', tag)
      document.title = this.$t('$siteTitle').toString()
      surfaceTemperatureStore.getOptions()
      surgeStore.getOptions()
      waterQualityStore.getOptions()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

#upper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6.25rem;
  padding: 0 2rem 0 6rem;
}

#lang-and-logos {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 30%;
  a {
    padding: 0 0.5rem 0 0.5rem;
    margin-right: 1rem;
  }
}

a {
  color: black;
  font-size: $font-size-l;
  text-decoration: none;
  &.current {
    color: $text-white;
    text-decoration: none;
    background-color: $background-blue;
    cursor: default;
  }
}

#project-logo {
  height: 45%;
}

#fund-logos {
  display: flex;
  padding-left: 2rem;
  img {
    margin: 0 1rem 0 1rem;
    height: 3rem;
    vertical-align: bottom;
  }
}
</style>
