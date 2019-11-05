<template>
  <div id="preview-container">
    <div v-for="module in modules" :key="module.name">
      <DataPreviewTable :module="module" />
    </div>
  </div>
</template>


<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import DataPreviewTable from '@/components/dataPreview/DataPreviewTable.vue';
  import { mainState } from '@/store/mainState';
  @Component({
    components: {
      DataPreviewTable,
    },
  })
  export default class DataPreview extends Vue {
    get modules() {
      return mainState.selectedAttributeModules;
    }
  }
</script>


<style lang="scss" scoped>
  #preview-container {
    overflow-x: auto;
  }
</style>