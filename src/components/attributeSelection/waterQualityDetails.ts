import { Component, Vue } from 'vue-property-decorator';
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import DecimalInput from '@/components/common/DecimalInput.vue';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';
import { mainState } from '@/store/mainState';

@Component({
  components: {
    OptionsSelection,
    DecimalInput,
  },
})
export default class WaterQualityDetails extends Vue {
  get module() {
    return waterQualityModule;
  }

  get depthStartError() {
    return mainState.isError('$missingDepthStart') ||
      mainState.isError('$depthStartGreaterThanDepthEnd');
  }

  get depthEndError() {
    return mainState.isError('$missingDepthEnd') || mainState.isError('$depthStartGreaterThanDepthEnd');
  }

  get selected() {
    return waterQualityModule.selectedDepth.option;
  }
  set selected(value) {
    const copy = { ...waterQualityModule.selectedDepth };
    copy.option = value;
    waterQualityModule.selectedDepth = copy;
  }

  get depthStart() {
    return waterQualityModule.selectedDepth.start!;
  }

  set depthStart(value: number) {
    const copy = { ...waterQualityModule.selectedDepth };
    copy.start = value;
    waterQualityModule.selectedDepth = copy;
  }

  get depthEnd() {
    return waterQualityModule.selectedDepth.end!;
  }

  set depthEnd(value: number) {
    const copy = { ...waterQualityModule.selectedDepth };
    copy.end = value;
    waterQualityModule.selectedDepth = copy;
  }
}
