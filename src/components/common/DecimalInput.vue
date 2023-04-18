<template>
  <input
    type="number"
    :class="[error ? 'input-box warn-border' : 'input-box']"
    :min="min"
    :step="'0.' + decimals"
    :max="max"
    :value="value"
    :disabled="disabled"
    @input="input($event.target as HTMLInputElement)"
    :aria-label="ariaLabel"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      required: false,
    },
    decimals: {
      type: Number,
      required: false,
      default: 1,
    },
    min: {
      type: Number,
      required: false,
      default: 0,
    },
    max: {
      type: Number,
      required: false,
    },
    value: {
      type: Number,
      required: false,
    },
    ariaLabel: {
      type: String,
      required: true,
    },
    error: {
      type: Boolean,
      required: false,
    },
  },
  methods: {
    input(target: HTMLInputElement) {
      const value = target.value;
      if (value !== '') {
        this.$emit('input', Number((+value).toFixed(this.decimals)));
      } else {
        this.$emit('input', null);
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';
.input-box {
  width: 3.5rem;
  margin: 0.5rem;
  font-family: 'TitilliumWeb';
  text-align: center;
  font-size: 1rem;
  color: $text-dark;
}
</style>
