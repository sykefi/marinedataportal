<template>
  <div>
    <OptionsSelection
      :header="$t('$waterQualityDetailsHeader')"
      :store="store"
      :two-columns="true"
    />
    <div class="selection-box attached">
      <!-- Depth selection -->
      <fieldset class="selection-content">
        <legend class="details-header">
          {{ $t('$depthDetailsHeader') }}
        </legend>
        <input
          type="radio"
          id="allLayers"
          :value="3"
          name="depth"
          v-model="selected"
        />
        <label for="allLayers">{{ $t('$allLayers') }}</label>
        <br />
        <input
          type="radio"
          id="surfaceLayer"
          :value="0"
          name="depth"
          v-model="selected"
        />
        <label for="surfaceLayer">{{ $t('$surfaceLayer') }}</label>
        <br />
        <input
          type="radio"
          id="depthInterval"
          :value="2"
          name="depth"
          v-model="selected"
        />
        <label for="depthInterval">{{ $t('$depthInterval') }}</label>
        <span v-if="selected === 2">
          <DecimalInput
            :max="1000"
            :decimals="5"
            :ariaLabel="$t('$depthStart')"
            v-model="depthStart"
            v-focus
            :error="depthStartError"
          />
          –
          <DecimalInput
            :max="1000"
            :decimals="5"
            :ariaLabel="$t('$depthEnd')"
            v-model="depthEnd"
            :error="depthEndError"
          />
          m
        </span>
        <br />
        <input
          type="radio"
          id="bottomLayer"
          :value="1"
          name="depth"
          v-model="selected"
        />
        <label for="bottomLayer">{{ $t('$bottomLayer') }}</label>
      </fieldset>
    </div>
  </div>
</template>

<script lang="ts">
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
</script>

<style lang="scss" scoped>
.attached {
  margin-top: 0;
  border-top: none;
  padding-top: 1rem;
}
</style>
