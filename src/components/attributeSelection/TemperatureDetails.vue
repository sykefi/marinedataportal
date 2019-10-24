<template>
  <div>
    <DetailsSelection :header="$t('$temperatureDetailsHeader')" :attributes="attributes"/>
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
export default class TemperatureDetails extends Vue {

  public attributes: string[] = ['$waveBuoys', '$mareograps', '$marineStations'];

  public beforeDestroy() {
      this.attributes.forEach((a) => attributeModule.removeAttribute(a));
  }
}
</script>
