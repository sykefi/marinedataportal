<template>
  <div class="details-button-wrapper">
    <button
      type="button"
      @click="$emit('empty-selection')"
      @mouseover="shown = true"
      @mouseleave="shown = false"
      :aria-label="contentKey"
    >
      X
    </button>
    <div v-if="shown" id="text" @click="shown = false">
      {{ contentKey }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    contentKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      shown: false,
      rightOverFlow: false,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
@import '@/assets/styles/common_styles.scss';
.details-button-wrapper {
  display: inline;
  position: relative;
  justify-content: center;
}
button {
  height: 2rem;
  width: 2rem;
  padding: 0;
  margin-left: 1rem;
  border-radius: 30px;
  box-shadow: 0 0.1rem 0 $border-shadow;
  color: $text-white;
  background: $background-remove;
  font-size: $font-size-xs;
  font-weight: bold;
  &:disabled {
    background: $disabled;
    pointer-events: none;
  }
  &:not(:disabled):hover {
    background: $background-remove-hover;
  }
}
#text {
  display: block;
  border: 1px solid;
  background: white;
  font-size: $font-size-xs;
  font-weight: normal;
  text-transform: none;
  text-align: center;
  padding: 0.2rem;
  color: $text-dark;
  position: absolute;
  right: 0;
  z-index: 995;
  max-width: 400px;
  user-select: none;
  white-space: pre-line;
}
</style>
