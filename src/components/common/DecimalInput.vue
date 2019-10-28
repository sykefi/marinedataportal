<template>
  <input
    type="number"
    class="input-box"
    :min="min"
    :step="'0.'+decimals"
    :max="max"
    :value="value"
    :disabled="disabled"
    @input="input($event.target.value)"
    :aria-label="ariaLabel"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component
export default class DecimalInput extends Vue {
  @Prop({ required: false, type: Boolean })
  public disabled!: boolean;
  @Prop({ required: false, type: Number, default: 1 })
  public decimals!: number;
  @Prop({ required: false, type: Number, default: 0 })
  public min!: number;
  @Prop({ required: true, type: Number })
  public max!: number;
  @Prop({ required: false, type: Number })
  public value!: number;
  @Prop({ required: true, type: String })
  public ariaLabel!: string;

  public input(value: string) {
    if (value !== '') {
      this.$emit('input', Number((+value).toFixed(this.decimals)));
    } else {
      this.$emit('input', null);
    }
  }
}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.input-box {
  max-width: 2.5rem;
  margin: 0.5rem;
  font-family: "TitilliumWeb";
  text-align: center;
}
</style>
