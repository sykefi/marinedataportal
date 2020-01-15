<template>
  <div>
    <SelectionHeader :header="$t('$attributeSelectionTitle')" />
    <p class="error" v-if="showAttributeError">{{$t(attributeErrorMessage)}}</p>
    <div class="selections-grid">
      <SelectionButton name="$secchiDepth" :module="secchiDepthModule" :disabled="!sykeApiOnline" />
      <SelectionButton name="$waterLevel" :module="waterLevelModule" :disabled="!fmiApiOnline" />
      <SelectionButton name="$iceThickness" :module="iceThicknessModule" :disabled="!sykeApiOnline" />
      <SelectionButton name="$surge" :module="surgeModule" :expandable="true" :disabled="!fmiApiOnline" />
      <SelectionButton
        name="$surfaceTemperature"
        :module="surfaceTemperatureModule"
        :expandable="true"
        :disabled="!sykeApiOnline && !fmiApiOnline"
      />
      <SelectionButton
        name="$waterQuality"
        :module="waterQualityModule"
        :expandable="true"
        :disabled="!sykeApiOnline"
      />
      <SelectionButton name="$phytoplankton" :module="phytoplanktonModule" :disabled="true" />
      <SelectionButton name="$benthicFauna" :module="benthicFaunaModule" :disabled="true" />
    </div>
    <div class="detail-box-container">
      <SurgeDetails v-if="surgeModule.isSelected" />
      <TemperatureDetails v-if="surfaceTemperatureModule.isSelected" />
    </div>
    <div v-if="waterQualityModule.isSelected">
      <WaterQualityDetails />
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.selections-grid {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  grid-row-gap: 2rem;
}
.detail-box-container {
  display: grid;
  grid-template-columns: 48% 48%;
  grid-template-rows: auto;
  grid-column-gap: 4%;
}
</style>

<script src="./attributeSelection.ts"></script>
