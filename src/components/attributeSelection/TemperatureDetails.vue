<template>
  <div>
    <OptionsSelection
      :header="$t('$temperatureDetailsHeader')"
      :module="module"
    />
  </div>
</template>

<script lang="ts">
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import { surfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    OptionsSelection,
  },
  computed: {
    module() {
      return surfaceTemperatureModule;
    },
  },
});
</script>
