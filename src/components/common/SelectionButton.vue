<template>
  <div>
    <button
      class="selection-button"
      :class="[selected ? 'selected' : 'not-selected']"
      @click="onClick"
      :aria-pressed="selected"
      :aria-expanded="selected && expandable"
      :disabled="disabled"
    >
      {{ $t(name) }}
    </button>
  </div>
</template>

<script lang="ts">
import { IAttributeStoreProperties } from 'pinia'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  props: {
    name: {
      type: String,
      required: true,
    },
    store: {
      type: Object as PropType<IAttributeStoreProperties>,
      required: true,
    },
    expandable: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    selected() {
      return this.store.isSelected
    },
  },
  methods: {
    onClick() {
      this.store.toggleSelected()
    },
  },
})
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/common_styles.scss';
.selection-button {
  font-family: 'OpenSans';
  font-size: $font-size-s;
  text-transform: uppercase;
  margin: 4px;
  width: 14rem;
  height: 3.3rem;
  border: 0.08rem solid;
  border-radius: 3.125rem;
  padding-left: 1rem;
  padding-right: 1rem;
}
.not-selected {
  background-color: $background-light;
  border-color: $border-light;
  color: $text-dark;
  &:not(:disabled):hover {
    background: $background-light-hover;
  }
}
.selected {
  background-color: $background-dark-blue;
  border-color: $border-dark;
  color: $text-white;
  &:not(:disabled):hover {
    background: $background-blue-hover;
  }
}
</style>
