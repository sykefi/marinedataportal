<template>
  <header>
    <div id="upper-header">
      <img />
      <div id="lang">
        <a
          href="#"
          :class="{current: $i18n.locale == 'fi'}"
          @click="setLanguage('fi')"
          aria-label="Vaihda kieleksi suomi."
        >FI</a>
        <a
          href="#"
          :class="{current: $i18n.locale == 'en'}"
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
      <ul>
        Huomioita:
        <li>
          <b>Safarilla</b> on havaittu jotain toimintaongelmia
        </li>
        <li>Kausivalinta ei toimi vielä FMI:n datalla (Vedenkorkeus)</li>
        <li>Karttabugi: laatikkovalinnan jälkeen yksittäisen valinnan poistaminen SHIFT+click kaataa kartan.</li>
      </ul>
      <b>Jos sivu näyttää jumittuneen latauspalluran pyörintään</b>
      , on tapahtunut joku virhe. Sivun päivittäminen nollaa tilanteen. Jos tiedät miten, nappaa virheilmoitus selaimen konsolista ja lähetä se alla mainittuun osoitteeseen.
      Palautetta ja kehitysideoita voi laittaa sähköpostilla simo.paasisalo@ymparisto.fi. Jos haluat päästä katsomaan projektityökalua, voit pyytää pääsyoikeutta samasta osoitteesta.
    </div>
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
import { mainState } from '@/store/mainState';

@Component({ i18n })
export default class Header extends Vue {
  get errorList() {
    const errorList = mainState.errorList;
    if (errorList.length) {
      const wrapper = this.$refs.focus;
      (wrapper as Element) ?.scrollIntoView(true);
      (wrapper as HTMLElement) ?.focus();
    }
    return errorList;
  }

  public setLanguage(tag: string) {
    i18n.locale = tag;
    waterQualityModule.setLanguage(tag);
    const html = document.documentElement;
    html.setAttribute('lang', tag);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
#upper-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 1.5rem 2rem 1.5rem;
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
}

a {
  margin: 6px;
  color: black;
  font-size: $font-size-l;
  text-decoration: none;
  padding: 0.1rem 0.5rem 0.1rem 0.5rem;
  &.current {
    color: $text-white;
    text-decoration: none;
    background-color: $background-blue;
    cursor: default;
  }
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
</style>