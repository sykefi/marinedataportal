<template>
  <div>
    <SelectionHeader :header="$t('$attributeSelectionTitle')" />
    <p class="error" v-if="showAttributeError">{{$t(attributeErrorMessage)}}</p>
    <div class="selections-grid">
      <SelectionButton name="$secchiDepth" />
      <SelectionButton name="$waterLevel" />
      <SelectionButton name="$iceThickness" />
      <SelectionButton name="$surge" @selected="toggleSurgeDetails()" :expandable="true" />
      <SelectionButton
        name="$surfaceTemperature"
        @selected="toggleTemperatureDetails()"
        :expandable="true"
      />
      <SelectionButton
        name="$waterQuality"
        @selected="toggleWaterQualityDetails()"
        :expandable="true"
      />
      <SelectionButton name="$phytoplankton" />
      <SelectionButton name="$benthicFauna" />
    </div>
    <div class="detail-box-container">
      <SurgeDetails v-if="showSurgeDetails" />
      <TemperatureDetails v-if="showTemperatureDetails" />
      <WaterQualityDetails v-if="showWaterQualityDetails" :downloadClicked="downloadClicked" />
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
