<template>
  <div id="header-wrapper">
    <span class="selection-header header-number">{{ headerNumber }}</span>
    <h2 class="selection-header">
      {{ headerWords }}
    </h2>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class SelectionHeader extends Vue {
  @Prop({ type: String })
  public readonly header!: string;

  get headerNumber() {
    return this.header.split(' ')[0];
  }

  get headerWords() {
    return this.header.slice(this.headerNumber.length, this.header.length);
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
#header-wrapper {
  display: flex;
  align-items: center;
  height: 4rem;
  margin-top: 4rem;
  margin-bottom: 3rem;
  border-bottom: 0.1rem solid $border-dark;
}

.selection-header {
  display: flex;
  align-items: center;
  padding-left: 1.2rem;
  width: 100%;
  height: 100%;
  text-align: left;
  font-size: $font-size-l;
  font-weight: bold;
  letter-spacing: 0.05rem;
  color: $text-white;
  background: $background-blue;
}

.header-number {
  justify-content: center;
  width: 4rem;
  color: $text-white;
  background-color: $background-dark-blue;
  padding: 0;
}
</style>