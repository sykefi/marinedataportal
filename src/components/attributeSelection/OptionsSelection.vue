<template>
  <div class="selection-box">
    <fieldset class="selection-content">
      <legend class="details-header">
        {{ header }}
      </legend>
      <p
        v-if="isWaterQualityModule"
        class="info-paragraph"
        v-html="$t('$veslaInfo')"
      />
      <label>
        <input
          type="checkbox"
          v-model="selectAll"
          :aria-label="$t('$selectAll')"
        />
        <b>{{ $t('$selectAll') }}</b>
      </label>
      <br />
      <div :class="[twoColumns ? 'two-columns' : '']">
        <label
          v-for="option in availableOptions"
          :key="option.id"
          class="option-label"
        >
          <input
            type="checkbox"
            :value="option.id"
            v-model="selectedIds"
            :disabled="!option.online"
          />
          {{ option.name }}
        </label>
      </div>
    </fieldset>
    <p v-if="showPhosphorusMessage" class="info-paragraph">
      {{ $t('$phosphorusMessage') }}
    </p>
  </div>
</template>

<script lang="ts">
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    header: {
      type: String,
      required: true,
    },
    module: {
      type: Object as PropType<IAttributeModuleWithOptions>,
      required: true,
    },
    twoColumns: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      showPhosphorusMessage: false,
    };
  },
  computed: {
    isWaterQualityModule() {
      return this.module.name === '$waterQuality';
    },
    selectedIds: {
      get() {
        return this.module.selectedIds;
      },
      set(e: number[]) {
        this.showPhosphorusMessage = this.includesPhosphorus(e);
        this.module.setSelectedOptions(e);
      },
    },
    availableOptions() {
      return this.module.availableOptions;
    },
    selectAll: {
      get() {
        return this.selectedIds
          ? this.selectedIds.length === this.module.availableOptions.length
          : false;
      },
      set(value: boolean) {
        if (value) {
          this.module.selectAll();
          if (this.includesPhosphorus(this.selectedIds)) {
            this.showPhosphorusMessage = true;
          }
        } else {
          this.module.deSelectAll();
          this.showPhosphorusMessage = false;
        }
      },
    },
    length() {
      return Math.ceil(this.module.availableOptions.length / 2);
    },
  },
  methods: {
    includesPhosphorus(ids: number[]) {
      if (this.module.name === '$waterQuality') {
        return ids.some((id) => [20, 33, 44, 55].includes(id));
      }
      return false;
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(v-bind(length), 1fr);
  grid-auto-flow: column;
}
.option-label {
  display: block;
}
</style>
