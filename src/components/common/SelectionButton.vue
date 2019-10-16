<template>
  <div>
    <button
      class="selection-button"
      v-bind:class="[selected ? 'selected' : 'not-selected']"
      @click="selected = !selected"
      :aria-pressed="selected"
    >{{title}}</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SelectionButton extends Vue {
  @Prop({ type: String })
  public readonly title!: string;

  public selected = false;
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/custom_inputs.scss";
.selection-button {
  border: 0.08rem solid;
  border-radius: 1.2rem;
  height: 3rem;
  width: 10rem;
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
  background-color: $background-blue;
  border-color: $border-dark;
  color: $text-white;
  &:not(:disabled):hover {
    background: $background-blue-hover;
  }
}
</style>