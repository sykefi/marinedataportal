<template>
  <div id="app">
    <AttributeSelection :downloadClicked="downloadClicked"/>
    <TimeSpanSelection :downloadClicked="downloadClicked" />
    <SiteSelection />
    <FileDownload @download-clicked="toggleDownload"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue';
import TimeSpanSelection from '@/components/timeSpanSelection/TimeSpanSelection.vue';
import SiteSelection from '@/components/SiteSelection.vue';
import FileDownload from '@/components/fileDownload/FileDownload.vue';
@Component({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    FileDownload,
  },
})
export default class App extends Vue {
  public downloadClicked = false;

  public toggleDownload() {
    this.downloadClicked = !this.downloadClicked;
  }
}
</script>

<style lang="scss">
//global styles
@import "@/assets/styles/font_faces.scss";
@import "@/assets/styles/variables.scss";
#app * {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  font-family: "TitilliumWeb", sans-serif;
  text-align: center;
  max-width: 50rem;
  margin-left: auto;
  margin-right: auto;
}

.hidden {
  display: none;
}
</style>

