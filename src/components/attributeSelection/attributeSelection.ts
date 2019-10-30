import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
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
  @Prop({ required: true, type: Boolean })
  public readonly downloadClicked!: boolean;

  public showSurgeDetails = attributeModule.isAttributeSelected('$surge');
  public showTemperatureDetails = attributeModule.isAttributeSelected('$surfaceTemperature');
  public showWaterQualityDetails = attributeModule.isAttributeSelected('$waterQuality');
  public attributeErrorMessage = '$noAttributesSelected';
  public showAttributeError = attributeModule.isError(this.attributeErrorMessage);

  @Watch('downloadClicked')
  public onDownloadClicked(val: boolean, oldVal: boolean) {
    if (val !== oldVal) {
      this.showAttributeError = attributeModule.isError(this.attributeErrorMessage);
    }
  }

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
