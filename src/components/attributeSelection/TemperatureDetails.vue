<template>
  <div>
    <OptionsSelection
      :header="$t('$temperatureDetailsHeader')"
      :store="store"
    />
  </div>
</template>

<script lang="ts">
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import { useSurfaceTemperatureStore } from '@/stores/surfaceTemperatureStore';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    OptionsSelection,
  },
  computed: {
    ...mapStores(useSurfaceTemperatureStore),
    store() {
      return this.surfaceTemperatureStore;
    },
  },
});
</script>
