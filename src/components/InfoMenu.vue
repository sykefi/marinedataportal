<template>
  <div>
    <div id="buttons">
      <InfoButton
        :button-text="$t('$serviceInfoTitle')"
        @show-info="showInfo = $event"
      />
      <InfoButton
        :button-text="$t('$instructionsTitle')"
        @show-info="showInstructions = $event"
      />
      <InfoButton
        :button-text="$t('$termsOfServiceTitle')"
        @show-info="showTerms = $event"
      />
    </div>
    <div id="info-text">
      <div v-if="showInfo">
        <h2>{{ $t('$serviceInfoTitle') }}</h2>
        <p v-html="$t('$serviceInfo')" />
      </div>
      <div v-if="showInstructions">
        <h2>{{ $t('$instructionsTitle') }}</h2>
        <p v-html="$t('$instructions')" />
      </div>
      <div v-if="showTerms">
        <h2>{{ $t('$termsOfServiceTitle') }}</h2>
        <p v-html="$t('$termsOfService')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import InfoButton from '@/components/InfoButton.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    InfoButton,
  },
  data() {
    return {
      showInfo: false,
      showInstructions: false,
      showTerms: false,
    };
  },
});
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';
#buttons {
  border-top: 0.05rem solid black;
  background-color: $border-dark;
  border-bottom: 0.2rem solid $border-red;
  margin: 0 auto;
  height: 4.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

#info-text {
  width: $content-width;
  text-align: left;
  padding: 0 4rem 0 4rem;
  margin-top: 2rem;
  margin: 0 auto;
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
