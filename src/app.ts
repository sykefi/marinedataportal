// tslint:disable: no-console
import { Component, Vue } from 'vue-property-decorator';
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue';
import TimeSpanSelection from '@/components/timeSpanSelection/TimeSpanSelection.vue';
import SiteSelection from '@/components/siteSelection/SiteSelection.vue';
import DataDownload from '@/components/dataDownload/DataDownload.vue';
import DataPreview from '@/components/dataPreview/DataPreview.vue';
import Header from '@/components/Header.vue';
import { mainState } from '@/store/mainState';
import { mapModule } from '@/store/mapModule';
import { getMareographs } from '@/queries/FMI/getMareographsQuery';
import { getBuoys } from '@/queries/FMI/getBuoysQuery';
@Component({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    DataDownload,
    DataPreview,
    Header,
  },
})
export default class App extends Vue {
  public hasError = false;

  get loading() {
    return mainState.loading;
  }

  public created() {
    getMareographs();
    getBuoys();
    mainState.populateSelectionOptions();
    mapModule.generateMapOptions();

    Vue.config.errorHandler = (e) => {
      this.hasError = true;
      console.error(e);
      return true;
    };
    window.onerror = (e) => {
      this.hasError = true;
      console.error(e);
    };
  }
}
