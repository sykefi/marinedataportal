<template>
  <header>
    <h1 id="site-title">{{ $t('$siteTitle')}}</h1>
    <h2 id="title-details">{{ $t('$siteDetails')}}</h2>
    <p id="image-origin" aria-hidden="true">{{ $t('$photo') }}: Ilkka Lastumäki</p>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';

@Component({ i18n })
export default class SiteTitle extends Vue { }
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

#site-title {
  font-size: $font-size-xxl;
  font-weight: bold;
  color: $text-white;
  padding-top: 5%;
}

#title-details {
  font-size: $font-size-l;
  font-weight: normal;
  color: $text-white;
}

#image-origin {
  font-size: $font-size-s;
  font-weight: normal;
  text-align: right;
  padding: 10% 2% 0 0;
  opacity: 0.8;
}
</style>