<template>
  <header>
    <div id="upper-header">
      <!-- Finnish -->
      <div id="project-logo" v-if="$i18n.locale === 'fi'">
        <a href="http://itameri.fi">
          <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi kotisivu." />
        </a>
      </div>

      <!-- English -->
      <div id="project-logo" v-if="$i18n.locale === 'en'">
        <a href="http://itameri.fi">
          <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi home." />
        </a>
      </div>

      <div id="lang-and-logos">
        <a
          href="#"
          :class="{current: $i18n.locale === 'fi'}"
          @click="setLanguage('fi')"
          aria-label="Vaihda kieleksi suomi."
        >FI</a>
        <a
          href="#"
          :class="{current: $i18n.locale === 'en'}"
          @click="setLanguage('en')"
          aria-label="Change language to English."
        >EN</a>

        <!-- Finnish -->
        <div id="fund-logos" v-show="$i18n.locale === 'fi'">
          <img
            src="@/assets/logos/emkr_fi.png"
            alt="Logo Euroopan meri- ja kalatalousrahasto, Suomen toimintaohjelma 2014-2020."
          />
          <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
        </div>

        <!-- English -->
        <div id="fund-logos" v-show="$i18n.locale === 'en'">
          <img
            src="@/assets/logos/emkr_eng.jpg"
            alt="Logo of the European maritime and fisheries fund, operational programme for Finland 2014-2020."
          />
          <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo" />
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import i18n from "@/locale/i18n";
import { waterQualityModule } from "@/store/attributeModules/waterQualityModule";
import { surfaceTemperatureModule } from "@/store/attributeModules/surfaceTemperatureModule";
import { surgeModule } from "@/store/attributeModules/surgeModule";

@Component({ i18n })
export default class Header extends Vue {
  public setLanguage(tag: string) {
    i18n.locale = tag;
    waterQualityModule.language = tag;
    const html = document.documentElement;
    html.setAttribute('lang', tag);
    document.title = this.$t('$siteTitle').toString();
    surfaceTemperatureModule.getOptions();
    surgeModule.getOptions();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

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