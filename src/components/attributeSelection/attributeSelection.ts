import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import SurgeDetails from '@/components/attributeSelection/SurgeDetails.vue';
import TemperatureDetails from '@/components/attributeSelection/TemperatureDetails.vue';
import WaterQualityDetails from '@/components/attributeSelection/WaterQualityDetails.vue';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';
import { surfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
import { surgeModule } from '@/store/attributeModules/surgeModule';
import { iceThicknessModule } from '@/store/attributeModules/iceThicknessModule';
import { benthicFaunaModule } from '@/store/attributeModules/benthicFaunaModule';
import { phytoPlanktonModule } from '@/store/attributeModules/phytoPlanktonModule';
import { secchiDepthModule } from '@/store/attributeModules/secchiDepthModule';
import { waterLevelModule } from '@/store/attributeModules/waterLevelModule';
import { mainState } from '@/store/mainState';
@Component({
  components: {
    SelectionHeader,
    SelectionButton,
    SurgeDetails,
    TemperatureDetails,
    WaterQualityDetails,
  },
})
export default class AttributeSelection extends Vue {

  public attributeErrorMessage = '$noAttributesSelected';

  get surgeModule() {
    return surgeModule;
  }

  get surfaceTemperatureModule() {
    return surfaceTemperatureModule;
  }

  get waterQualityModule() {
    return waterQualityModule;
  }

  get iceThicknessModule() {
    return iceThicknessModule;
  }

  get benthicFaunaModule() {
    return benthicFaunaModule;
  }

  get phytoplanktonModule() {
    return phytoPlanktonModule;
  }

  get secchiDepthModule() {
    return secchiDepthModule;
  }

  get waterLevelModule() {
    return waterLevelModule;
  }

  get showAttributeError() {
    return mainState.isError(this.attributeErrorMessage);
  }
}
