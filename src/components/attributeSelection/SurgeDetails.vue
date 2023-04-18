<template>
  <div>
    <OptionsSelection :header="$t('$surgeDetailsHeader')" :store="store" />
  </div>
</template>

<script lang="ts">
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import { useSurgeStore } from '@/stores/surgeStore';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    OptionsSelection,
  },
  computed: {
    ...mapStores(useSurgeStore),
    store() {
      return this.surgeStore;
    },
  },
});
</script>
