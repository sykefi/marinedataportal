<template>
  <div>
    <SelectionHeader :header="$t('$fileDownloadTitle')" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
@Component({
  components: {
    SelectionHeader,
    SelectionButton,
  },
})
export default class SiteSelection extends Vue {}
</script>

<style lang="scss">
@import "@/assets/styles/variables.scss";
</style>