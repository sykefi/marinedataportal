<template>
  <div class="selection-box attached">
    <fieldset class="selection-content">
      <legend class="details-header">{{$t('$depthDetailsHeader')}}</legend>
      <input type="radio" id="surfaceLayer" value="surfaceLayer" name="depth" v-model="selected" />
      <label for="surfaceLayer">{{$t('$surfaceLayer')}}</label>
      <br />
      <input
        type="radio"
        id="depthInterval"
        value="depthInterval"
        name="depth"
        v-model="selected"
        @click="setFocus()"
      />
      <label for="depthInterval">{{$t('$depthInterval')}}</label>
      <span>
        <input
          type="text"
          class="input-box"
          ref="depthStartInput"
          v-model.number="depthStart"
          :aria-label="$t('$depthStart')"
        />
        –
        <input
          type="text"
          class="input-box"
          v-model.number="depthEnd"
          :aria-label="$t('$depthEnd')"
        />
        m
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
  max-width: 2rem;
  margin: 0.5rem;
  font-family: "TitilliumWeb";
  text-align: center;
}
</style>

<script src="./depthSelection.ts"></script>
