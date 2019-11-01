<template>
  <div>
    <OptionsSelection :header="$t('$temperatureDetailsHeader')" :module="module" />
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
  import { surfaceTemperatureModule } from '@/store/attributeModules/sufaceTemperatureModule';
  import i18n from '@/locale/i18n';
  @Component({
    components: {
      OptionsSelection,
    },
  })
  export default class TemperatureDetails extends Vue {

    get module() {
      return surfaceTemperatureModule;
    }
  }
</script>
