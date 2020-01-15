// tslint:disable: no-console
import { Component, Vue } from 'vue-property-decorator';
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue';
import TimeSpanSelection from '@/components/timeSpanSelection/TimeSpanSelection.vue';
import SiteSelection from '@/components/siteSelection/SiteSelection.vue';
import DataDownload from '@/components/dataDownload/DataDownload.vue';
import DataPreview from '@/components/dataPreview/DataPreview.vue';
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { mainState } from '@/store/mainState';
import { mapModule } from '@/store/mapModule';
import { getMareographs } from '@/queries/FMI/getMareographsQuery';
import { getBuoys } from '@/queries/FMI/getBuoysQuery';
import { sykeApiIsOnline } from './queries/Vesla/getApiStatusQuery';
@Component({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    DataDownload,
    DataPreview,
    Header,
    Footer,
  },
})
export default class App extends Vue {
  public hasError = false;

  get loading() {
    return mainState.loading;
  }

  public async created() {
    Vue.config.errorHandler = (e) => {
      this.hasError = true;
      console.error(e);
      return true;
    };
    window.onerror = (e) => {
      this.hasError = true;
      console.error(e);
    };

    const sykeIsOnline = await sykeApiIsOnline();
    mainState.setSykeApiOnlineStatus(sykeIsOnline);

    // window.onunhandledrejection = (e: any) => {
    //   this.hasError = true;
    //   console.error(e);
    // };
  }

  public mounted() {
    getMareographs();
    getBuoys();
    if (mainState.sykeApiOnline) {
      mainState.populateSelectionOptions();
    }
    mapModule.generateMapOptions();
  }
}
