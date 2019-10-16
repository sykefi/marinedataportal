<template>
  <h2 class="selection-header">{{header}}</h2>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SelectionHeader extends Vue {
  @Prop({ type: String })
  public readonly header!: string;
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.selection-header {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "OpenSans";
  font-size: $font-size-l;
  font-weight: normal;
  color: $text-white;
  background: $background-blue;
  height: 2.5rem;
  margin-top: 3rem;
  margin-bottom: 2rem;
}
</style>