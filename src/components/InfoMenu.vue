<template>
  <div>
    <div id="app-info">
      <div class="common fill1" />
      <div class="common info">
        <InfoButton :buttonText="$t('$serviceInfoTitle')" @show-info="onShowInfo" />
        <InfoButton :buttonText="$t('$instructionsTitle')" @show-info="onShowInstructions" />
        <InfoButton :buttonText="$t('$termsOfServiceTitle')" @show-info="onShowTerms" />
      </div>
      <div class="common fill2" />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InfoButton from '@/components/InfoButton.vue';

@Component({
  components: {
    InfoButton,
  }
})
export default class InfoMenu extends Vue {
  public showInfo: boolean = false;
  public showInstructions: boolean = false;
  public showTerms: boolean = false;

  public onShowInfo(isPressed: boolean) {
    this.showInfo = isPressed;
  }

  public onShowInstructions(isPressed: boolean) {
    this.showInstructions = isPressed;
  }

  public onShowTerms(isPressed: boolean) {
    this.showTerms = isPressed;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";
#app-info {
  display: grid;
  grid-template:
    "fill1 div fill2" 4.4rem
    ". info ."
    / 1fr 65rem 1fr;
}

.common {
  border-top: 0.05rem solid black;
  border-bottom: 0.2rem solid $border-red;
  background-color: $border-dark;
}

.fill1 {
  grid-area: fill1;
}

.fill2 {
  grid-area: fill2;
}

.info {
  grid-area: div;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

#arrow-icon {
  color: $background-bright-blue;
  font-size: $font-size-xl;
  padding-right: 0.5rem;
}

.info-button {
  font-family: "TitilliumWeb";
  color: $text-white;
  font-weight: bold;
  font-size: $font-size-l;
  letter-spacing: 0.02rem;
  margin: 0;
  padding: 0;
  background-color: $border-dark;
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