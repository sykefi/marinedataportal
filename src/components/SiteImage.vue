<template>
  <div id="lower-header">
    <img id="title-background" src="@/assets/imgs/auringonlasku.png" alt="" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import i18n from '@/locale/i18n';

@Component({ i18n })
export default class SiteImage extends Vue { }
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

#lower-header {
  position: relative;
}

#title-background {
  width: 100%;
  border-bottom: 0.2rem solid $border-red;
}
</style>