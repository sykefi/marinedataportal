<template>
  <div>
    <SelectionHeader :header="$t('$attributeSelectionTitle')" />
    <p class="error" v-if="showAttributeError">{{$t(attributeErrorMessage)}}</p>
    <div class="selections-grid">
      <SelectionButton name="$secchiDepth" :module="secchiDepthModule" />
      <SelectionButton name="$waterLevel" :module="waterLevelModule" />
      <SelectionButton name="$iceThickness" :module="iceThicknessModule" />
      <SelectionButton name="$surge" :module="surgeModule" :expandable="true" />
      <SelectionButton
        name="$surfaceTemperature"
        :module="surfaceTemperatureModule"
        :expandable="true"
      />
      <SelectionButton name="$waterQuality" :module="waterQualityModule" :expandable="true" />
      <SelectionButton name="$phytoplankton" :module="phytoplanktonModule" />
      <SelectionButton name="$benthicFauna" :module="benthicFaunaModule" />
    </div>
    <div class="detail-box-container">
      <SurgeDetails v-if="surgeModule.isSelected" />
      <TemperatureDetails v-if="surfaceTemperatureModule.isSelected" />
      <WaterQualityDetails v-if="waterQualityModule.isSelected" />
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