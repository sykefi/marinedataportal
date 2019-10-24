
import { Vue } from 'vue-property-decorator';
import { attributeModule } from '@/store/attributeModule';
export default class WaterQualityDetails extends Vue {
  public $refs!: {
    depthStartInput: HTMLElement,
  };

  get selected() {
    return attributeModule.selectedDepth;
  }
  set selected(value) {
    attributeModule.setSelectedDepth(value);
    if (value !== 'depthInterval') {
      attributeModule.setDepthStart(undefined);
      attributeModule.setDepthEnd(undefined);
    }
  }

  get depthStart() {
    return attributeModule.depthStart;
  }

  set depthStart(value) {
    if (value !== undefined) {
      if (value >= 0) {
        attributeModule.setDepthStart(value);
      }
    }
  }

  get depthEnd() {
    return attributeModule.depthEnd;
  }

  set depthEnd(value) {
    if (value !== undefined) {
      if (value >= 0) {
        attributeModule.setDepthEnd(value);
      }
    }
  }

  public setFocus() {
    this.$refs.depthStartInput.focus();
  }
}
