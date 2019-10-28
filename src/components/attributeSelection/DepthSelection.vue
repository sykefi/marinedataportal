<template>
  <div class="selection-box attached">
    <fieldset class="selection-content">
      <legend class="details-header">{{$t('$depthDetailsHeader')}}</legend>
      <input type="radio" id="surfaceLayer" value="surfaceLayer" name="depth" v-model="selected" />
      <label for="surfaceLayer">{{$t('$surfaceLayer')}}</label>
      <br />
      <input type="radio" id="depthInterval" value="depthInterval" name="depth" v-model="selected" />
      <label for="depthInterval">{{$t('$depthInterval')}}</label>
      <span v-if="selected==='depthInterval'">
        <DecimalInput
          :max="1000"
          :decimals="5"
          :ariaLabel="$t('$depthStart')"
          v-model="depthStart"
          v-focus
        />–
        <DecimalInput
          :max="1000"
          :decimals="5"
          :ariaLabel="$t('$depthEnd')"
          v-model="depthEnd"
        />m
      </span>
      <br />
      <input type="radio" id="bottomLayer" value="bottomLayer" name="depth" v-model="selected" />
      <label for="bottomLayer">{{$t('$bottomLayer')}}</label>
    </fieldset>
  </div>
</template>

<style lang="scss">
  @import "@/assets/styles/variables.scss";
  .attached {
    margin-top: 0;
    border-top: none;
    padding-top: 1rem;
  }
  .input-box {
    max-width: 3rem;
    margin: 0.5rem;
    font-family: "TitilliumWeb";
    text-align: center;
  }
</style>

<script src="./depthSelection.ts"></script>
