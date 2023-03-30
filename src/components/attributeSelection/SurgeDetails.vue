<template>
  <div>
    <OptionsSelection :header="$t('$surgeDetailsHeader')" :module="module" />
  </div>
</template>

<script lang="ts">
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import { surgeModule } from '@/store/attributeModules/surgeModule';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    OptionsSelection,
  },
  computed: {
    module() {
      return surgeModule;
    },
  },
});
</script>
