<template>
  <div>
    <div id="app-info">
      <div id="buttons">
        <InfoButton :buttonText="$t('$serviceInfoTitle')" @show-info="showInfo = $event" />
        <InfoButton :buttonText="$t('$instructionsTitle')" @show-info="showInstructions = $event" />
        <InfoButton :buttonText="$t('$termsOfServiceTitle')" @show-info="showTerms = $event" />
      </div>
    </div>
    <div id="info-text">
      <div v-if="showInfo">
        <h2>{{$t('$serviceInfoTitle')}}</h2>
        <p>{{$t('$serviceInfo')}}</p>
      </div>
      <div v-if="showInstructions">
        <h2>{{$t('$instructionsTitle')}}</h2>
        <p>{{$t('$instructions')}}</p>
      </div>
      <div v-if="showTerms">
        <h2>{{$t('$termsOfServiceTitle')}}</h2>
        <p>{{$t('$termsOfService')}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import InfoButton from '@/components/InfoButton.vue';

  @Component({
    components: {
      InfoButton,
    },
  })
  export default class InfoMenu extends Vue {
    public showInfo: boolean = false;
    public showInstructions: boolean = false;
    public showTerms: boolean = false;
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/styles/variables.scss";
  #app-info {
    display: grid;
    grid-template:
      ". buttons ." 4.4rem
      ". info ."
      / 1fr 65rem 1fr;
    border-top: 0.05rem solid black;
    background-color: $border-dark;
    border-bottom: 0.2rem solid $border-red;

    #buttons {
      grid-area: buttons;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }
  }

  #info-text {
    grid-area: info;
    text-align: left;
    padding: 0 4rem 0 4rem;
    margin-top: 2rem;
    h2 {
      padding-top: 1rem;
      font-size: $font-size-l;
      font-weight: bold;
      letter-spacing: 0.05rem;
    }
    p {
      font-size: $font-size-m;
    }
  }
</style>
