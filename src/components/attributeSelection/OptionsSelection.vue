<template>
  <div class="selection-box">
    <fieldset class="selection-content">
      <legend class="details-header">
        {{ header }}
      </legend>
      <p
        v-if="isWaterQualityStore"
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
import { IAttributeStoreStateWithOptions } from '@/stores/types/IAttributeStoreStateWithOptions';
import { IAttributeStoreProperties, Store } from 'pinia';
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    header: {
      type: String,
      required: true,
    },
    store: {
      type: Object as PropType<IAttributeStoreProperties>,
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
    isWaterQualityStore() {
      return this.store.$id === 'waterQuality';
    },
    selectedIds: {
      get() {
        return this.store.selectedIds;
      },
      set(e: number[]) {
        this.showPhosphorusMessage = this.includesPhosphorus(e);
        if (this.store.setSelectedOptions) {
          this.store.setSelectedOptions(e);
        }
      },
    },
    availableOptions() {
      return this.store.availableOptions;
    },
    selectAll: {
      get() {
        return this.selectedIds
          ? this.selectedIds.length === this.store.availableOptions?.length
          : false;
      },
      set(value: boolean) {
        if (value && this.store.selectAll) {
          this.store.selectAll();
          if (this.includesPhosphorus(this.selectedIds ?? [])) {
            this.showPhosphorusMessage = true;
          }
        } else if (this.store.deSelectAll) {
          this.store.deSelectAll();
          this.showPhosphorusMessage = false;
        }
      },
    },
    length() {
      return Math.ceil(this.store.availableOptions?.length ?? 0 / 2);
    },
  },
  methods: {
    includesPhosphorus(ids: number[]) {
      if (this.isWaterQualityStore) {
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
