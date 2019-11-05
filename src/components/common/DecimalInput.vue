<template>
  <input
    type="number"
    v-bind:class="[error ? 'input-box warn-border' : 'input-box']"
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
  import { Component, Prop, Vue } from 'vue-property-decorator';
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
    @Prop({ required: false, type: Boolean })
    public error!: boolean;

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
    width: 3.5rem;
    margin: 0.5rem;
    font-family: "TitilliumWeb";
    text-align: center;
    font-size: 1rem;
    color: $text-dark;
  }
</style>
