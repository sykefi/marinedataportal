import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import DecimalInput from '@/components/common/DecimalInput.vue';
import { defineComponent } from 'vue';
import { DepthOptions, useWaterQualityStore } from '@/stores/waterQualityStore';
import { useMainStateStore } from '@/stores/mainStateStore';
import { mapStores } from 'pinia';

export default defineComponent({
  components: {
    OptionsSelection,
    DecimalInput,
  },
  computed: {
    ...mapStores(useWaterQualityStore, useMainStateStore),
    store() {
      return this.waterQualityStore;
    },
    depthStartError() {
      return (
        this.mainStateStore.isError('$missingDepthStart') ||
        this.mainStateStore.isError('$depthStartGreaterThanDepthEnd')
      );
    },
    depthEndError() {
      return (
        this.mainStateStore.isError('$missingDepthEnd') ||
        this.mainStateStore.isError('$depthStartGreaterThanDepthEnd')
      );
    },
    selected: {
      get() {
        return this.waterQualityStore.selectedDepth.option;
      },
      set(value: DepthOptions) {
        const copy = { ...this.waterQualityStore.selectedDepth };
        copy.option = value;
        this.waterQualityStore.selectedDepth = copy;
      },
    },
    depthStart: {
      get() {
        return this.waterQualityStore.selectedDepth.start!;
      },
      set(value: number) {
        const copy = { ...this.waterQualityStore.selectedDepth };
        copy.start = value;
        this.waterQualityStore.selectedDepth = copy;
      },
    },
    depthEnd: {
      get() {
        return this.waterQualityStore.selectedDepth.end!;
      },
      set(value: number) {
        const copy = { ...this.waterQualityStore.selectedDepth };
        copy.end = value;
        this.waterQualityStore.selectedDepth = copy;
      },
    },
  },
});
