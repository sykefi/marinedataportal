// tslint:disable: no-console
import AttributeSelection from '@/components/attributeSelection/AttributeSelection.vue';
import TimeSpanSelection from '@/components/timeSpanSelection/TimeSpanSelection.vue';
import SiteSelection from '@/components/siteSelection/SiteSelection.vue';
import DataDownload from '@/components/dataDownload/DataDownload.vue';
import DataPreview from '@/components/dataPreview/DataPreview.vue';
import AppHeader from '@/components/AppHeader.vue';
import InfoMenu from '@/components/InfoMenu.vue';
import AppFooter from '@/components/AppFooter.vue';
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
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    AttributeSelection,
    TimeSpanSelection,
    SiteSelection,
    DataDownload,
    DataPreview,
    AppHeader,
    InfoMenu,
    AppFooter,
    SiteTitle,
    SiteImage,
    ErrorMessages,
  },
  computed: {
    hasError() {
      return mainState.hasError;
    },
    loading() {
      return mainState.loading;
    },
  },
  async mounted() {
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
  },
});
