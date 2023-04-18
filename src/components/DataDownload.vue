<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
    <button
      :disabled="isDownloading"
      class="download-button"
      @click="downloadData"
    >
      {{ $t('$fetch') }}
    </button>
  </div>
</template>

<script lang="ts">
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import { validateSearchParameters } from '@/helpers';
import { useMainStateStore } from '@/stores/mainStateStore';
import { useSearchParameterStore } from '@/stores/searchParameterStore';
import { useWaterQualityStore } from '@/stores/waterQualityStore';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SelectionHeader,
  },
  computed: {
    ...mapStores(
      useMainStateStore,
      useWaterQualityStore,
      useSearchParameterStore
    ),
    isDownloading() {
      return this.mainStateStore.loading;
    },
  },
  methods: {
    downloadData() {
      const errors = [...this.waterQualityStore.errors];
      errors.push(
        ...validateSearchParameters(
          true,
          this.searchParameterStore.selectedSites,
          this.mainStateStore.selectedAttributeStores,
          this.searchParameterStore.timeSpanStart,
          this.searchParameterStore.timeSpanEnd,
          this.searchParameterStore.periodStart,
          this.searchParameterStore.periodEnd
        )
      );

      if (errors.length === 0) {
        this.mainStateStore.downloadData();
      }
      this.mainStateStore.setErrorList(errors);
    },
  },
});
</script>
