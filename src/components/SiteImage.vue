<template>
  <div>
    <img id="title-background" src="@/assets/imgs/Image_Ilkka_Lastumaki.jpg" alt="" />
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


#title-background {
  width: 100%;
}
</style>