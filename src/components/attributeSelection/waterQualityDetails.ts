import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import DecimalInput from '@/components/common/DecimalInput.vue';
import {
  DepthOptions,
  waterQualityModule,
} from '@/store/attributeModules/waterQualityModule';
import { mainState } from '@/store/mainState';
import i18n from '@/locale/i18n';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    OptionsSelection,
    DecimalInput,
  },
  computed: {
    module() {
      return waterQualityModule;
    },
    depthStartError() {
      return (
        mainState.isError('$missingDepthStart') ||
        mainState.isError('$depthStartGreaterThanDepthEnd')
      );
    },
    depthEndError() {
      return (
        mainState.isError('$missingDepthEnd') ||
        mainState.isError('$depthStartGreaterThanDepthEnd')
      );
    },
    selected: {
      get() {
        return waterQualityModule.selectedDepth.option;
      },
      set(value: DepthOptions) {
        const copy = { ...waterQualityModule.selectedDepth };
        copy.option = value;
        waterQualityModule.selectedDepth = copy;
      },
    },
    depthStart: {
      get() {
        return waterQualityModule.selectedDepth.start!;
      },
      set(value: number) {
        const copy = { ...waterQualityModule.selectedDepth };
        copy.start = value;
        waterQualityModule.selectedDepth = copy;
      },
    },
    depthEnd: {
      get() {
        return waterQualityModule.selectedDepth.end!;
      },
      set(value: number) {
        const copy = { ...waterQualityModule.selectedDepth };
        copy.end = value;
        waterQualityModule.selectedDepth = copy;
      },
    },
  },
  mounted() {
    waterQualityModule.language = i18n.global.locale;
  },
});
