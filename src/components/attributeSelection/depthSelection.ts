
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { attributeModule } from '@/store/attributeModule';
import DecimalInput from '@/components/common/DecimalInput.vue';
@Component({
  components: {
    DecimalInput,
  },
})
export default class WaterQualityDetails extends Vue {
  @Prop({ required: true, type: Boolean })
  public readonly downloadClicked!: boolean;

  public depthStartError = attributeModule.isError('$missingDepthStart') || attributeModule.isError('$depthStartGreaterThanDepthEnd');
  public depthEndError = attributeModule.isError('$missingDepthEnd') || attributeModule.isError('$depthStartGreaterThanDepthEnd');

  @Watch('downloadClicked')
  public onDownloadClicked(val: boolean, oldVal: boolean) {
    if (val !== oldVal) {
      this.depthStartError = attributeModule.isError('$missingDepthStart') || attributeModule.isError('$depthStartGreaterThanDepthEnd');
      this.depthEndError = attributeModule.isError('$missingDepthEnd') || attributeModule.isError('$depthStartGreaterThanDepthEnd');
    }
  }

  get selected() {
    return attributeModule.selectedDepth;
  }
  set selected(value) {
    attributeModule.setSelectedDepth(value);
    if (value !== 'depthInterval') {
      attributeModule.setDepthStart(null);
      attributeModule.setDepthEnd(null);
    }
  }

  get depthStart() {
    return attributeModule.depthStart!;
  }

  set depthStart(value: number) {
    attributeModule.setDepthStart(value);
  }

  get depthEnd() {
    return attributeModule.depthEnd!;
  }

  set depthEnd(value: number) {
    attributeModule.setDepthEnd(value);
  }
}
