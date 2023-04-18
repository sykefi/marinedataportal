<template>
  <header>
    <h1 id="site-title">
      {{ $t('$siteTitle') }}
    </h1>
    <h2 id="title-details">
      {{ $t('$siteDetails') }}
    </h2>
    <p id="image-origin" aria-hidden="true">
      {{ $t('$photo') }}: Ilkka Lastumäki
    </p>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

#site-title {
  font-size: $font-size-xxl;
  font-weight: bold;
  color: $text-dark;
  padding-top: 3%;
}

#title-details {
  font-size: $font-size-l;
  font-weight: normal;
  color: $text-dark;
}

#image-origin {
  font-size: $font-size-s;
  font-weight: normal;
  text-align: right;
  padding: 20% 2% 0 0;
}
</style>
