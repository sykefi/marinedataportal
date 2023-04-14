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
import ExampleMap from '@/components/siteSelection/ExampleMap.vue';
import { getMareographs } from '@/queries/FMI/getMareographsQuery';
import { getBuoys } from '@/queries/FMI/getBuoysQuery';
import { sykeApiIsOnline } from './queries/Vesla/getApiStatusQuery';
import { fmiApiIsOnline } from './queries/FMI/getApiStatusQuery';
import { defineComponent } from 'vue';
import { useMainStateStore } from './stores/mainStateStore';
import { useSurgeStore } from './stores/surgeStore';
import { useSurfaceTemperatureStore } from './stores/surfaceTemperatureStore';
import { useMapStore } from './stores/mapStore';

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
    ExampleMap,
  },
  computed: {
    hasError() {
      const mainState = useMainStateStore();
      return mainState.hasError;
    },
    loading() {
      const mainState = useMainStateStore();
      return mainState.loading;
    },
  },
  async mounted() {
    const mainState = useMainStateStore();
    const surgeStore = useSurgeStore();
    const surfaceTemperatureStore = useSurfaceTemperatureStore();
    const mapStore = useMapStore();

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
      surgeStore.getOptions();
      surfaceTemperatureStore.getOptions();
    }

    mapStore.generateMapOptions();
  },
});
