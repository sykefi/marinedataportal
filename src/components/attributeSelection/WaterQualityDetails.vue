<template>
  <div>
    <OptionsSelection
      :header="$t('$waterQualityDetailsHeader')"
      :module="module"
      :twoColumns="true"
    />
    <div class="selection-box attached">
      <!-- Depth selection -->
      <fieldset class="selection-content">
        <legend class="details-header">{{$t('$depthDetailsHeader')}}</legend>
        <input type="radio" id="surfaceLayer" :value="0" name="depth" v-model="selected" />
        <label for="surfaceLayer">{{$t('$surfaceLayer')}}</label>
        <br />
        <input type="radio" id="depthInterval" :value="2" name="depth" v-model="selected" />
        <label for="depthInterval">{{$t('$depthInterval')}}</label>
        <span v-if="selected===2">
          <DecimalInput
            :max="1000"
            :decimals="5"
            :ariaLabel="$t('$depthStart')"
            v-model="depthStart"
            v-focus
            :error="depthStartError"
          />–
          <DecimalInput
            :max="1000"
            :decimals="5"
            :ariaLabel="$t('$depthEnd')"
            v-model="depthEnd"
            :error="depthEndError"
          />m
        </span>
        <br />
        <input type="radio" id="bottomLayer" :value="1" name="depth" v-model="selected" />
        <label for="bottomLayer">{{$t('$bottomLayer')}}</label>
      </fieldset>
    </div>
  </div>
</template>

<script src="./waterQualityDetails.ts"/>

<style lang="scss" scoped>
.attached {
  margin-top: 0;
  border-top: none;
  padding-top: 1rem;
}
</style>