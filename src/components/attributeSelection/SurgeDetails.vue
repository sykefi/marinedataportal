<template>
  <div>
    <DetailsSelection :header="$t('$surgeDetailsHeader')" :attributes="attributes"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DetailsSelection from '@/components/attributeSelection/DetailsSelection.vue';
import { attributeModule } from '@/store/attributeModule';
@Component({
  components: {
    DetailsSelection,
  },
})
export default class SurgeDetails extends Vue {

  public attributes: string[] = ['$waveDirection', '$waterTemperature',
      '$waveHeight', '$waveletDivergence', '$modalPeriod'];

  public beforeDestroy() {
      this.attributes.forEach((a) => attributeModule.removeAttribute(a));
  }
}
</script>
