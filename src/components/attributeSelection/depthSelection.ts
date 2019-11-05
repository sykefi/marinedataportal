
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import DecimalInput from '@/components/common/DecimalInput.vue';
import { mainState } from '@/store/mainState';
import { searchParameterModule } from '@/store/searchParameterModule';
@Component({
  components: {
    DecimalInput,
  },
})
export default class WaterQualityDetails extends Vue {
  get depthStartError() {
    return mainState.isError('$missingDepthStart') ||
      mainState.isError('$depthStartGreaterThanDepthEnd');
  }

  get depthEndError() {
    return mainState.isError('$missingDepthEnd') || mainState.isError('$depthStartGreaterThanDepthEnd');
  }

  get selected() {
    return searchParameterModule.selectedDepth;
  }
  set selected(value) {
    searchParameterModule.setSelectedDepth(value);
    if (value !== 'depthInterval') {
      searchParameterModule.setDepthStart(null);
      searchParameterModule.setDepthEnd(null);
    }
  }

  get depthStart() {
    return searchParameterModule.depthStart!;
  }

  set depthStart(value: number) {
    searchParameterModule.setDepthStart(value);
  }

  get depthEnd() {
    return searchParameterModule.depthEnd!;
  }

  set depthEnd(value: number) {
    searchParameterModule.setDepthEnd(value);
  }
}
