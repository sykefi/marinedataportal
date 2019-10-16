<template>
  <div>
    <SelectionHeader :header="$t('$attributeSelectionTitle')" />
    <div class="selections-grid">
      <SelectionButton :title="$t('$secchiDepth')" />
      <SelectionButton :title="$t('$iceThickness')" />
      <SelectionButton :title="$t('$waterLevel')" />
      <SelectionButton :title="$t('$surge')" />
      <SelectionButton :title="$t('$surfaceTemperature')" />
      <SelectionButton :title="$t('$waterQuality')" />
      <SelectionButton :title="$t('$phytoplankton')" />
      <SelectionButton :title="$t('$benthicFauna')" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/SelectionButton.vue';
@Component({
  components: {
    SelectionHeader,
    SelectionButton,
  },
})
export default class AttributeSelection extends Vue {}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.selections-grid {
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  grid-template-rows: auto;
  grid-row-gap: 2rem;
}
</style>