<template>
  <div>
    <OptionsSelection :header="$t('$surgeDetailsHeader')" :module="module" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
  import { surgeModule } from '@/store/attributeModules/surgeModule';
  @Component({
    components: {
      OptionsSelection,
    },
  })
  export default class SurgeDetails extends Vue {
    get module() {
      return surgeModule;
    }
  }
</script>
