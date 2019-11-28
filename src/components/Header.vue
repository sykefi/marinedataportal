<template>
  <header>
    <div id="upper-header">
      <img />
      <div id="lang">
        <a href="#" :class="{current: $i18n.locale == 'fi'}" @click="setLanguage('fi')" aria-label="Vaihda kieleksi suomi.">FI</a>
        <a href="#" :class="{current: $i18n.locale == 'en'}" @click="setLanguage('en')" aria-label="Change language to English.">EN</a>
      </div>
    </div>
    <div id="lower-header">
      <h1 id="site-title">{{ $t('$siteTitle')}}</h1>
    </div>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';

@Component({ i18n })
export default class Header extends Vue {
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
</style>