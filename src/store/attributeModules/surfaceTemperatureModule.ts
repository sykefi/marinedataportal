import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModuleWithOptions } from './IAttributeModuleWithOptions';
import i18n from '@/locale/i18n';
import { IAttributeOption } from './IAttributeOption';
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
import { DepthOptions } from './waterQualityModule';
import { toCommonFormat, toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { mainState } from '../mainState';
import { Commit } from 'vuex';

const TEMP_ID_IN_VESLA = 25; // DeterminationCombinationId for temperature in Vesla

export const SurfaceTemperatureModule = {
  state: () => ({
    name: '$surfaceTemperature',
    loading: false,
    isSelected: false,
    availableOptions: [] as IAttributeOption[],
    selectedIds: [] as number[],
    data: null as IResponseFormat[] | null,
    siteTypes: [] as SiteTypes[],
  }),
  getters: {
    previewData(state: IAttributeModuleWithOptions) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    hasOptionsSelected(state: IAttributeModuleWithOptions) {
      return !!state.selectedIds.length;
    },
    rowCount(state: IAttributeModuleWithOptions) {
      return state.data ? state.data.length : 0;
    },
  },
  mutations: {
    toggleSelected(state: IAttributeModuleWithOptions) {
      state.isSelected = !state.isSelected;
    },
    setSelectedOptions(state: IAttributeModuleWithOptions, ids: number[]) {
      state.selectedIds = ids;
      state.siteTypes = ids;
    },
    selectAll(state: IAttributeModuleWithOptions) {
      // arrays must be emptied before selecting all options, otherwise strange things may happen
      state.selectedIds = [];
      state.siteTypes = [];
      state.availableOptions.forEach((option) => {
        if (option.online) {
          state.selectedIds.push(option.id);
          state.siteTypes.push(option.id);
        }
      });
    },
    deSelectAll(state: IAttributeModuleWithOptions) {
      state.selectedIds = [];
      state.siteTypes = [];
    },
    getOptions(state: IAttributeModuleWithOptions) {
      state.availableOptions = [];
      state.availableOptions.push({
        id: SiteTypes.FmiBuoy,
        name: i18n.global.t('$waveBuoys').toString(),
        online: mainState.fmiApiOnline,
      });
      state.availableOptions.push({
        id: SiteTypes.Mareograph,
        name: i18n.global.t('$mareographs').toString(),
        online: mainState.fmiApiOnline,
      });
      state.availableOptions.push({
        id: SiteTypes.Vesla,
        name: i18n.global.t('$marineStations').toString(),
        online: mainState.sykeApiOnline,
      });
    },
    startLoading(state: IAttributeModuleWithOptions) {
      state.loading = true;
    },
    stopLoading(state: IAttributeModuleWithOptions) {
      state.loading = false;
    },
    setData(state: IAttributeModuleWithOptions, newData: IResponseFormat[]) {
      state.data = newData;
    },
  },
  actions: {
    async getData({ commit }: { commit: Commit }, params: CommonParameters) {
      commit('startLoading');
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
      commit('setData', tempData);
      commit('stopLoading');
    },
    async getAvailableVeslaSiteIds(
      { commit }: { commit: Commit },
      params: CommonParameters
    ) {
      commit('startLoading');
      const res = await getWaterQualitySiteIds(params, [TEMP_ID_IN_VESLA], {
        option: DepthOptions.SurfaceLayer,
      });
      commit('stopLoading');
      return res;
    },
  },
};
