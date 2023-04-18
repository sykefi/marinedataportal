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

<script lang="ts">
import SelectionHeader from '@/components/common/SelectionHeader.vue'
import SelectionButton from '@/components/common/SelectionButton.vue'
import SurgeDetails from '@/components/attributeSelection/SurgeDetails.vue'
import TemperatureDetails from '@/components/attributeSelection/TemperatureDetails.vue'
import WaterQualityDetails from '@/components/attributeSelection/WaterQualityDetails.vue'
import { defineComponent } from 'vue'
import { useMainStateStore } from '@/stores/mainStateStore'
import { useSurgeStore } from '@/stores/surgeStore'
import { useSurfaceTemperatureStore } from '@/stores/surfaceTemperatureStore'
import { useWaterQualityStore } from '@/stores/waterQualityStore'
import { useIceThicknessStore } from '@/stores/iceThicknessStore'
import { useBenthicFaunaStore } from '@/stores/benthicFaunaStore'
import { usePhytoPlanktonStore } from '@/stores/phytoPlanktonStore'
import { useSecchiDepthStore } from '@/stores/secchiDepthStore'
import { useWaterLevelStore } from '@/stores/waterLevelStore'
import { mapStores } from 'pinia'

export default defineComponent({
  components: {
    SelectionHeader,
    SelectionButton,
    SurgeDetails,
    TemperatureDetails,
    WaterQualityDetails,
  },
  data() {
    return {
      attributeErrorMessage: '$noAttributesSelected',
    }
  },
  computed: {
    ...mapStores(
      useMainStateStore,
      useSurgeStore,
      useSurfaceTemperatureStore,
      useWaterQualityStore,
      useIceThicknessStore,
      useBenthicFaunaStore,
      usePhytoPlanktonStore,
      useSecchiDepthStore,
      useWaterLevelStore
    ),
    sykeApiOnline() {
      return this.mainStateStore.sykeApiOnline
    },
    fmiApiOnline() {
      return this.mainStateStore.fmiApiOnline
    },
    showAttributeError() {
      return this.mainStateStore.isError(this.attributeErrorMessage)
    },
  },
})
</script>

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
