import { CommonParameters } from '@/queries/commonParameters';
import i18n from '@/locale/i18n';
import { IAttributeModuleWithOptions } from './types/IAttributeStoreStateWithOptions';
import { IAttributeOption } from './types/IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { SiteTypes } from '@/queries/site';
import {
  getWaveData,
  WaveQueryParameters,
} from '@/queries/FMI/getWaveDataQuery';
import { toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { Commit } from 'vuex';

export const SurgeModule = {
  state: () => ({
    name: '$surge',
    loading: false,
    isSelected: false,
    availableOptions: [] as IAttributeOption[],
    selectedIds: [] as number[],
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.FmiBuoy, SiteTypes.Mareograph],
  }),
  getters: {
    rowCount(state: IAttributeModuleWithOptions) {
      return state.data ? state.data.length : 0;
    },
    previewData(state: IAttributeModuleWithOptions) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    hasOptionsSelected(state: IAttributeModuleWithOptions) {
      return !!state.selectedIds.length;
    },
  },
  mutations: {
    toggleSelected(state: IAttributeModuleWithOptions) {
      state.isSelected = !state.isSelected;
    },
    setSelectedOptions(state: IAttributeModuleWithOptions, ids: number[]) {
      state.selectedIds = ids;
    },
    selectAll(state: IAttributeModuleWithOptions) {
      state.availableOptions.forEach((option) => {
        if (!state.selectedIds.includes(option.id)) {
          state.selectedIds.push(option.id);
        }
      });
    },
    deSelectAll(state: IAttributeModuleWithOptions) {
      state.selectedIds = [];
    },
    getOptions(state: IAttributeModuleWithOptions) {
      state.availableOptions = [];
      const keys = [
        '$waveDirection',
        '$waterTemperature',
        '$waveHeight',
        '$modalPeriod',
        '$waveletDivergence',
      ];
      keys.forEach((key, id) => {
        state.availableOptions.push({
          id,
          name: i18n.global.t(key).toString(),
          online: true,
        });
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
    async getData(
      { commit, state }: { commit: Commit; state: IAttributeModuleWithOptions },
      params: CommonParameters
    ) {
      commit('startLoading');
      const queryParams: WaveQueryParameters[] = [];
      if (state.selectedIds.includes(0)) {
        queryParams.push(WaveQueryParameters.direction);
      }
      if (state.selectedIds.includes(1)) {
        // temp
        queryParams.push(WaveQueryParameters.waterTemperature);
      }
      if (state.selectedIds.includes(2)) {
        // height
        queryParams.push(WaveQueryParameters.waveHeight);
      }
      if (state.selectedIds.includes(3)) {
        // modal period
        queryParams.push(WaveQueryParameters.modalPeriod);
      }
      if (state.selectedIds.includes(4)) {
        // deviation
        queryParams.push(WaveQueryParameters.directionDeviation);
      }

      const results = await getWaveData(params, queryParams);
      const inFmiFormat = results.map((r) => {
        let parameterName = '';
        let unit = '';
        switch (r.parameterName) {
          case WaveQueryParameters.direction:
            parameterName = 'Wave direction';
            unit = '°';
            break;
          case WaveQueryParameters.directionDeviation:
            parameterName = 'Direction deviation';
            unit = '°';
            break;
          case WaveQueryParameters.modalPeriod:
            parameterName = 'Modal period';
            unit = 's';
            break;
          case WaveQueryParameters.waterTemperature:
            parameterName = 'Water temperature';
            unit = '°C';
            break;
          case WaveQueryParameters.waveHeight:
            parameterName = 'Wave height';
            unit = 'm';
            break;
          default:
            break;
        }
        return toFmiFormat(r, parameterName, unit);
      });
      commit('setData', inFmiFormat);
      commit('stopLoading');
    },
    async getAvailableVeslaSiteIds() {
      return [];
    },
  },
};
