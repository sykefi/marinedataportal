import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import SurgeDetails from '@/components/attributeSelection/SurgeDetails.vue';
import TemperatureDetails from '@/components/attributeSelection/TemperatureDetails.vue';
import WaterQualityDetails from '@/components/attributeSelection/WaterQualityDetails.vue';
import { attributeModule } from '@/store/attributeModule';
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
  public showSurgeDetails = attributeModule.isAttributeSelected('$surge');
  public showTemperatureDetails = attributeModule.isAttributeSelected('$surfaceTemperature');
  public showWaterQualityDetails = attributeModule.isAttributeSelected('$waterQuality');

  public toggleSurgeDetails() {
    this.showSurgeDetails = !this.showSurgeDetails;
  }

  public toggleTemperatureDetails() {
    this.showTemperatureDetails = !this.showTemperatureDetails;
  }

  public toggleWaterQualityDetails() {
    this.showWaterQualityDetails = !this.showWaterQualityDetails;
  }
}
