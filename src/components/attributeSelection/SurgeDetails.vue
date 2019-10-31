<template>
  <div>
    <DetailsSelection :header="$t('$surgeDetailsHeader')" :attributes="attributes" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import DetailsSelection from '@/components/attributeSelection/DetailsSelection.vue';
  import { attributeModule } from '@/store/attributeModule';
  import i18n from '@/locale/i18n';
  @Component({
    components: {
      DetailsSelection,
    },
  })
  export default class SurgeDetails extends Vue {

    get attributes(): string[] {
      const keys = ['$waveDirection', '$waterTemperature', '$waveHeight', '$waveletDivergence', '$modalPeriod'];
      const translated: string[] = [];
      for (const key of keys) {
        translated.push(i18n.t(key).toString());
      }
      return translated;
    }

    public beforeDestroy() {
      this.attributes.forEach((a) => attributeModule.removeAttribute(a));
    }
  }
</script>
