import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import SurgeDetails from '@/components/attributeSelection/SurgeDetails.vue';
import TemperatureDetails from '@/components/attributeSelection/TemperatureDetails.vue';
import WaterQualityDetails from '@/components/attributeSelection/WaterQualityDetails.vue';
import { defineComponent } from 'vue';
import { useMainStateStore } from '@/stores/mainStateStore';
import { useSurgeStore } from '@/stores/surgeStore';
import { useSurfaceTemperatureStore } from '@/stores/surfaceTemperatureStore';
import { useWaterQualityStore } from '@/stores/waterQualityStore';
import { useIceThicknessStore } from '@/stores/iceThicknessStore';
import { useBenthicFaunaStore } from '@/stores/benthicFaunaStore';
import { usePhytoPlanktonStore } from '@/stores/phytoPlanktonStore';
import { useSecchiDepthStore } from '@/stores/secchiDepthStore';
import { useWaterLevelStore } from '@/stores/waterLevelStore';
import { mapStores } from 'pinia';

export default defineComponent({
  components: {
    SelectionHeader,
    SelectionButton,
    SurgeDetails,
    TemperatureDetails,
    WaterQualityDetails,
  },
  data() {
    return {
      attributeErrorMessage: '$noAttributesSelected',
    };
  },
  computed: {
    ...mapStores(
      useMainStateStore,
      useSurgeStore,
      useSurfaceTemperatureStore,
      useWaterQualityStore,
      useIceThicknessStore,
      useBenthicFaunaStore,
      usePhytoPlanktonStore,
      useSecchiDepthStore,
      useWaterLevelStore
    ),
    sykeApiOnline() {
      return this.mainStateStore.sykeApiOnline;
    },
    fmiApiOnline() {
      return this.mainStateStore.fmiApiOnline;
    },
    showAttributeError() {
      return this.mainStateStore.isError(this.attributeErrorMessage);
    },
  },
});
