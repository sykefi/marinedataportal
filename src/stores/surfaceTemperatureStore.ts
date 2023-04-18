import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeStoreStateWithOptions } from './types/IAttributeStoreStateWithOptions';
import i18n from '@/locale/i18n';
import { PREVIEW_ROW_COUNT } from '@/config';
import {
  getWaterQuality,
  getWaterQualitySiteIds,
} from '@/queries/Vesla/getWaterQualityQuery';
import { SiteTypes } from '@/queries/site';
import { getMareographTemperatures } from '@/queries/FMI/getMareographTemperatureQuery';
import {
  getWaveData,
  WaveQueryParameters,
} from '@/queries/FMI/getWaveDataQuery';
import { DepthOptions } from './waterQualityStore';
import { toCommonFormat, toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { defineStore } from 'pinia';
import { useMainStateStore } from './mainStateStore';

const TEMP_ID_IN_VESLA = 25; // DeterminationCombinationId for temperature in Vesla

export const useSurfaceTemperatureStore = defineStore('surfaceTemperature', {
  state: (): IAttributeStoreStateWithOptions => ({
    name: '$surfaceTemperature',
    loading: false,
    isSelected: false,
    availableOptions: [],
    selectedIds: [] as number[],
    data: null,
    siteTypes: [],
  }),
  getters: {
    previewData(state) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    hasOptionsSelected(state) {
      return !!state.selectedIds.length;
    },
    rowCount(state) {
      return state.data ? state.data.length : 0;
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true;
      const tempData: IResponseFormat[] = [];
      let hasVeslaData = false;
      if (params.veslaSites.length) {
        const data = await getWaterQuality(params, [TEMP_ID_IN_VESLA], {
          option: DepthOptions.SurfaceLayer,
        });
        if (data) {
          tempData.push(...data);
        }
        hasVeslaData = !!tempData.length;
      }
      if (params.mareographSites.length) {
        const response = await getMareographTemperatures(params);
        const inCorrectFormat = response.map((r) =>
          hasVeslaData
            ? toCommonFormat(r, 'Temperature', '°C')
            : toFmiFormat(r, 'Temperature', '°C')
        );
        tempData.push(...inCorrectFormat);
      }
      if (params.buoySites.length) {
        const response = await getWaveData(params, [
          WaveQueryParameters.waterTemperature,
        ]);
        const inCorrectFormat = response.map((r) =>
          hasVeslaData
            ? toCommonFormat(r, 'Temperature', '°C')
            : toFmiFormat(r, 'Temperature', '°C')
        );
        tempData.push(...inCorrectFormat);
      }
      this.setData(tempData);
      this.loading = false;
    },
    async getAvailableVeslaSiteIds(params: CommonParameters) {
      this.loading = true;
      const res = await getWaterQualitySiteIds(params, [TEMP_ID_IN_VESLA], {
        option: DepthOptions.SurfaceLayer,
      });
      this.loading = false;
      return res;
    },
    toggleSelected() {
      this.isSelected = !this.isSelected;
    },
    setSelectedOptions(ids: number[]) {
      this.selectedIds = ids;
      this.siteTypes = ids;
    },
    selectAll() {
      // arrays must be emptied before selecting all options, otherwise strange things may happen
      this.selectedIds = [];
      this.siteTypes = [];
      this.availableOptions.forEach((option) => {
        if (option.online) {
          this.selectedIds.push(option.id);
          this.siteTypes.push(option.id);
        }
      });
    },
    deSelectAll() {
      this.selectedIds = [];
      this.siteTypes = [];
    },
    getOptions() {
      const mainState = useMainStateStore();
      this.availableOptions = [];
      this.availableOptions.push({
        id: SiteTypes.FmiBuoy,
        name: i18n.global.t('$waveBuoys').toString(),
        online: mainState.fmiApiOnline,
      });
      this.availableOptions.push({
        id: SiteTypes.Mareograph,
        name: i18n.global.t('$mareographs').toString(),
        online: mainState.fmiApiOnline,
      });
      this.availableOptions.push({
        id: SiteTypes.Vesla,
        name: i18n.global.t('$marineStations').toString(),
        online: mainState.sykeApiOnline,
      });
    },
    setData(newData: IResponseFormat[]) {
      this.data = newData;
    },
  },
});
