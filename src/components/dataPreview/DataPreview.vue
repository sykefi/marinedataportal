<template>
  <div id="preview-container">
    <p v-if="showInfo" class="info-paragraph">
      {{ $t('$dataPreviewInfo') }}
    </p>
    <div v-for="store in stores" :key="store.name">
      <DataPreviewTable :store="store" />
    </div>
  </div>
</template>

<script lang="ts">
import DataPreviewTable from '@/components/dataPreview/DataPreviewTable.vue'
import { useMainStateStore } from '@/stores/mainStateStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    DataPreviewTable,
  },
  computed: {
    ...mapStores(useMainStateStore),
    showInfo() {
      let isTrue = false
      const stores = this.mainStateStore.selectedAttributeStores
      stores.forEach((store) => {
        if (store.rowCount > 3) {
          isTrue = true
        }
      })
      return isTrue
    },
    stores() {
      return this.mainStateStore.selectedAttributeStores
    },
  },
})
</script>

<style lang="scss" scoped>
#preview-container {
  overflow-x: auto;
}
</style>
