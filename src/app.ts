// tslint:disable: no-console
import { Component, Vue } from 'vue-property-decorator';
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue';
import TimeSpanSelection from '@/components/timeSpanSelection/TimeSpanSelection.vue';
import SiteSelection from '@/components/siteSelection/SiteSelection.vue';
import DataDownload from '@/components/dataDownload/DataDownload.vue';
import DataPreview from '@/components/dataPreview/DataPreview.vue';
import Header from '@/components/Header.vue';
import InfoMenu from '@/components/InfoMenu.vue';
import Footer from '@/components/Footer.vue';
import SiteTitle from '@/components/SiteTitle.vue';
import SiteImage from '@/components/SiteImage.vue';
import ErrorMessages from '@/components/ErrorMessages.vue';
import { mainState } from '@/store/mainState';
import { mapModule } from '@/store/mapModule';
import { getMareographs } from '@/queries/FMI/getMareographsQuery';
import { getBuoys } from '@/queries/FMI/getBuoysQuery';
import { sykeApiIsOnline } from './queries/Vesla/getApiStatusQuery';
import { surgeModule } from './store/attributeModules/surgeModule';
import { surfaceTemperatureModule } from './store/attributeModules/surfaceTemperatureModule';
import { fmiApiIsOnline } from './queries/FMI/getApiStatusQuery';
@Component({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    DataDownload,
    DataPreview,
    Header,
    InfoMenu,
    Footer,
    SiteTitle,
    SiteImage,
    ErrorMessages,
  },
})
export default class App extends Vue {
  get hasError() {
    return mainState.hasError;
  }

  get loading() {
    return mainState.loading;
  }

  public created() {
    Vue.config.errorHandler = (e) => {
      mainState.setError(true);
      console.error(e);
      return true;
    };
    window.onerror = (e) => {
      mainState.setError(true);
      console.error(e);
    };
  }

  public async mounted() {
    const sykeIsOnline = await sykeApiIsOnline();
    mainState.setSykeApiOnlineStatus(sykeIsOnline);
    const fmiIsOnline = await fmiApiIsOnline();
    mainState.setFmiApiOnlineStatus(fmiIsOnline);

    if (fmiIsOnline) {
      getMareographs();
      getBuoys();
    }
    if (sykeIsOnline) {
      mainState.populateSelectionOptions();
    } else {
      // If syke api is not responding, do not try to fetch water quality options
      surgeModule.getOptions();
      surfaceTemperatureModule.getOptions();
    }

    mapModule.generateMapOptions();
  }
}
