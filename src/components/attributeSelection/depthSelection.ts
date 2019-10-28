
import { Vue, Component } from 'vue-property-decorator';
import { attributeModule } from '@/store/attributeModule';
import DecimalInput from '@/components/common/DecimalInput.vue';
@Component({
  components: {
    DecimalInput,
  },
})
export default class WaterQualityDetails extends Vue {

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
