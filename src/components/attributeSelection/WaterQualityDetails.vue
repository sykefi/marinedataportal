<template>
  <div>
    <DetailsSelection :header="$t('$waterQualityDetailsHeader')" :attributes="attributes"/>
    <DepthSelection />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DetailsSelection from '@/components/attributeSelection/DetailsSelection.vue';
import DepthSelection from '@/components/attributeSelection/DepthSelection.vue';
import { attributeModule } from '@/store/attributeModule';
@Component({
  components: {
    DetailsSelection,
    DepthSelection,
  },
})
export default class WaterQualityDetails extends Vue {

  public attributes: string[] = ['$alkalinity', '$aluminum', '$ammonium', '$arsenic',
        '$acidity', '$mercuryAAS'];

  public beforeDestroy() {
      this.attributes.forEach((a) => attributeModule.removeAttribute(a));
  }
}
</script>