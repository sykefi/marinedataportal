<template>
  <div>
    <SelectionHeader :header="$t('$attributeSelectionTitle')" />
    <p class="error" v-if="showAttributeError">
      {{ $t(attributeErrorMessage) }}
    </p>
    <div id="button-wrapper">
      <div class="selections-grid">
        <SelectionButton
          name="$secchiDepth"
          :store="secchiDepthStore"
          :disabled="!sykeApiOnline"
        />
        <SelectionButton
          name="$waterLevel"
          :store="waterLevelStore"
          :disabled="!fmiApiOnline"
        />
        <SelectionButton
          name="$iceThickness"
          :store="iceThicknessStore"
          :disabled="!sykeApiOnline"
        />
        <SelectionButton
          name="$surge"
          :store="surgeStore"
          :expandable="true"
          :disabled="!fmiApiOnline"
        />
        <SelectionButton
          name="$surfaceTemperature"
          :store="surfaceTemperatureStore"
          :expandable="true"
          :disabled="!sykeApiOnline && !fmiApiOnline"
        />
        <SelectionButton
          name="$waterQuality"
          :store="waterQualityStore"
          :expandable="true"
          :disabled="!sykeApiOnline"
        />
      </div>
    </div>
    <div class="detail-box-container">
      <SurgeDetails v-if="surgeStore.isSelected" />
      <TemperatureDetails v-if="surfaceTemperatureStore.isSelected" />
    </div>
    <div v-if="waterQualityStore.isSelected">
      <WaterQualityDetails />
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/styles/variables.scss';
#button-wrapper {
  display: grid;
  grid-template:
    '. but .'
    / 4rem 1fr 4rem;
}
.selections-grid {
  grid-area: but;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
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
