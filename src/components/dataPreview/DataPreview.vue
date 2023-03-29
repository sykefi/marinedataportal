<template>
  <div id="preview-container">
    <p v-if="showInfo" class="info-paragraph">
      {{ $t("$dataPreviewInfo") }}
    </p>
    <div v-for="module in modules" :key="module.name">
      <DataPreviewTable :module="module" />
    </div>
  </div>
</template>

<script lang="ts">
import DataPreviewTable from "@/components/dataPreview/DataPreviewTable.vue";
import { mainState } from "@/store/mainState";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    DataPreviewTable,
  },
  computed: {
    showInfo() {
      let isTrue = false;
      const modules = mainState.selectedAttributeModules;
      modules.forEach((module) => {
        if (module.rowCount > 3) {
          isTrue = true;
        }
      });
      return isTrue;
    },
    modules() {
      return mainState.selectedAttributeModules;
    },
  },
});
</script>

<style lang="scss" scoped>
#preview-container {
  overflow-x: auto;
}
</style>
