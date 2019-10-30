<template>
  <div>
    <button
      class="selection-button"
      v-bind:class="[selected ? 'selected' : 'not-selected']"
      @click="onClick"
      :aria-pressed="selected"
      :aria-expanded="selected && expandable"
    >{{$t(name)}}</button>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/custom_inputs.scss";
.selection-button {
  font-family: "OpenSans";
  font-size: $font-size-m;
  margin: 4px;
  width: 10rem;
  height: 3rem;
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

<script src="./selectionButton.ts"></script>
