<template>
  <header>
    <div id="top-header">
      <!-- Finnish -->
      <div id="top-logos" v-show="$i18n.locale === 'fi'">
        <a href="https://syke.fi/fi-FI">
          <img
            id="syke-logo"
            src="@/assets/logos/SYKE_fi_en.jpg"
            alt="Suomen ympäristökeskuksen kotisivu."
          />
        </a>
        <a href="https://ilmatieteenlaitos.fi/">
          <img id="il-logo" src="@/assets/logos/il_fi_en.png" alt="Ilmatieteenlaitoksen kotisivu." />
        </a>
        <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
        <img
          src="@/assets/logos/emkr_fi.png"
          alt="Logo Euroopan meri- ja kalatalousrahasto, Suomen toimintaohjelma 2014-2020."
        />
      </div>

      <!-- English -->
      <div id="top-logos" v-show="$i18n.locale === 'en'">
        <a href="https://syke.fi/en-US">
          <img
            id="syke-logo"
            src="@/assets/logos/SYKE_fi_en.jpg"
            alt="Finnish Environment Institute home."
          />
        </a>
        <a href="https://en.ilmatieteenlaitos.fi/">
          <img
            id="il-logo"
            src="@/assets/logos/il_fi_en.png"
            alt="Finnish Meteorological Institute home."
          />
        </a>
        <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo" />
        <img
          src="@/assets/logos/emkr_eng.jpg"
          alt="Logo of the European maritime and fisheries fund, operational programme for Finland 2014-2020."
        />
      </div>

      <div id="upper-header">
        <!-- Finnish -->
        <div class="header-logos" v-if="$i18n.locale === 'fi'">
          <a href="http://itameri.fi">
            <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi kotisivu." />
          </a>
        </div>

        <!-- English -->
        <div class="header-logos" v-if="$i18n.locale === 'en'">
          <a href="http://itameri.fi">
            <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi home." />
          </a>
        </div>

        <div id="lang">
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
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';
import { surfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
import { surgeModule } from '@/store/attributeModules/surgeModule';

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
#top-header {
  display: grid;
  grid-template:
    "fund fund fund"
    ". lang ."
    / auto 65rem auto;
}

#upper-header {
  grid-area: lang;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 6.25rem;
}

#lang {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 5rem;
  height: 30%;
  a {
    padding: 0rem 0.5rem 0rem 0.5rem;
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

.header-logos {
  height: 45%;
  a {
    padding-right: 4rem;
  }
}

#top-logos {
  grid-area: fund;
  height: 3.5rem;
  background-color: $background-light;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  img {
    margin: 0 1rem 0 1rem;
    height: 70%;
    vertical-align: bottom;
  }
}

#il-logo {
  width: 12rem;
  height: auto;
}

#syke-logo {
  width: 3rem;
  height: auto;
}
</style>