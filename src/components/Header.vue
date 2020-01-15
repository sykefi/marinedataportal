<template>
  <header>
    <!-- Finnish -->
    <div id="top-logos" v-show="$i18n.locale === 'fi'">
      <p>Hanke saa tukea Euroopan meri- ja kalatalousrahastosta</p>
      <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo." />
      <img
        src="@/assets/logos/emkr_fi.png"
        alt="Logo Euroopan meri- ja kalatalousrahasto, Suomen toimintaohjelma 2014-2020."
      />
    </div>

    <!-- English -->
    <div id="top-logos" v-show="$i18n.locale === 'en'">
      <p>The project is funded by the European Maritime and Fisheries Fund</p>
      <img src="@/assets/logos/EU_fi_en.jpg" alt="EU logo" />
      <img
        src="@/assets/logos/emkr_eng.jpg"
        alt="Logo of the European maritime and fisheries fund, operational programme for Finland 2014-2020."
      />
    </div>

    <div id="upper-header">
      <!-- Finnish -->
      <div class="header-logos" v-if="$i18n.locale === 'fi'">
        <a href="https://syke.fi/fi-FI">
          <img src="@/assets/logos/SYKE_fi_en.jpg" alt="Suomen ympäristökeskuksen kotisivu." />
        </a>
        <a href="https://ilmatieteenlaitos.fi/">
          <img id="il-logo" src="@/assets/logos/il_fi_en.png" alt="Ilmatieteenlaitoksen kotisivu." />
        </a>
        <div class="header-logos with-divider">
          <a href="http://itameri.fi">
            <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi kotisivu." />
          </a>
        </div>
      </div>

      <!-- English -->
      <div class="header-logos" v-if="$i18n.locale === 'en'">
        <a href="https://syke.fi/en-US">
          <img src="@/assets/logos/SYKE_fi_en.jpg" alt="Finnish Environment Institute home." />
        </a>
        <a href="https://en.ilmatieteenlaitos.fi/">
          <img
            id="il-logo"
            src="@/assets/logos/il_fi_en.png"
            alt="Finnish Meteorological Institute home."
          />
        </a>
        <div class="header-logos with-divider">
          <a href="http://itameri.fi">
            <img src="@/assets/logos/Hankelogo_fi_en.png" alt="Itämeri.fi home." />
          </a>
        </div>
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

    <div id="lower-header">
      <h1 id="site-title">{{ $t('$siteTitle')}}</h1>
    </div>
    <div :style="{ textAlign: 'left' }">
      Tämä on
      <b>Meritietoportaalin latauspalvelun kehitysversio</b>. Latauspalvelu hakee dataa FMI:n ja SYKE:n rajapinnoista.
      <br />
      <b>Jos sivu näyttää jumittuneen latauspalluran pyörintään</b>
      , on tapahtunut joku virhe. Sivun päivittäminen nollaa tilanteen. Jos tiedät miten, nappaa virheilmoitus selaimen konsolista ja lähetä se alla mainittuun osoitteeseen.
      Palautetta ja kehitysideoita voi laittaa sähköpostilla simo.paasisalo@ymparisto.fi. Jos haluat päästä katsomaan projektityökalua, voit pyytää pääsyoikeutta samasta osoitteesta.
    </div>
    <p v-if="!sykeApiOnline && !fmiApiOnline" class="error-notification">{{ $t("$serviceUnavailable") }}</p>
    <p v-else-if="!sykeApiOnline" id="error-paragraph">{{ $t("$sykeApiDownInfo") }}</p>
    <p v-else-if="!fmiApiOnline" id="error-paragraph">{{ $t("$fmiApiDownInfo") }}</p>
    <div ref="focus" tabindex="-1" id="focus-to-error">
      <fieldset id="error-content">
        <li v-for="error in errorList" :key="error" class="error">{{$t(error)}}</li>
      </fieldset>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';
import { surfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
import { surgeModule } from '@/store/attributeModules/surgeModule';
import { mainState } from '@/store/mainState';

@Component({ i18n })
export default class Header extends Vue {

  get sykeApiOnline() {
    return mainState.sykeApiOnline;
  }

  get fmiApiOnline() {
    return mainState.fmiApiOnline;
  }

  get errorList() {
    const errorList = mainState.errorList;
    if (errorList.length) {
      const wrapper = this.$refs.focus;
      (wrapper as Element)?.scrollIntoView(true);
      (wrapper as HTMLElement)?.focus();
    }
    return errorList;
  }

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
  padding: 1.2rem;
  height: 4rem;
}
#lower-header {
  display: flex;
  justify-content: center;
  background-color: $background-blue;
  border-bottom: 0.2rem solid $border-red;
}
#site-title {
  font-family: "TitilliumWeb";
  font-size: $font-size-xxl;
  font-weight: bold;
  color: $text-white;
}
#lang {
  display: flex;
  justify-content: space-evenly;
  width: 5rem;
  font-weight: bold;
  height: 60%;
  a {
    padding: 0.3rem 0.5rem 0.3rem 0.5rem;
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

#error-paragraph {
  padding: 1rem;
  background: $border-warn;
  color: #fff;
  text-align: center;
  bottom: 0;
  left: 0;
}

#error-content {
  border: none;
  text-align: left;
  padding-top: 2rem;
  margin: 1rem 7rem 0 7rem;
}

#focus-to-error {
  &:focus {
    outline-color: white;
  }
}

.header-logos {
  width: 87%;
  height: 100%;
  display: flex;
  align-items: center;
  a {
    height: 100%;
    display: flex;
    padding-right: 4rem;
    align-items: center;
  }
}

.with-divider {
  border-right: 0.05rem solid $border-divide;
  height: 60%;
  justify-content: flex-end;
  img {
    height: 100%;
  }
}

#top-logos {
  height: 4.5rem;
  background-color: $background-light;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  img {
    margin: 0 1rem 0 1rem;
    height: 70%;
  }
}

#il-logo {
  width: 18rem;
  height: auto;
}
</style>