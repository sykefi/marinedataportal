import {
  getWaterQualityOptions,
  IWaterQualityOption,
} from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getWaterQuality,
  getWaterQualitySiteIds,
} from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { alphabeticCompare } from '@/helpers';
import { SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import i18n from '@/locale/i18n';
import { Commit } from 'vuex';

export enum DepthOptions {
  SurfaceLayer,
  SeaFloorLayer,
  DepthInterval,
  AllLayers,
}

export interface IDepthSettings {
  option: DepthOptions;
  start?: number;
  end?: number;
}

type IWaterQualityState = IAttributeModuleWithOptions & {
  selectedDepth: IDepthSettings;
  options: IWaterQualityOption[];
};

export const WaterQualityModule = {
  state: () => ({
    name: '$waterQuality',
    isSelected: false,
    loading: false,
    selectedIds: [] as number[],
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.Vesla],
    selectedDepth: { option: DepthOptions.AllLayers } as IDepthSettings,
    options: [] as IWaterQualityOption[],
    availableOptions: [] as IAttributeOption[],
  }),
  getters: {
    previewData(state: IWaterQualityState) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    hasOptionsSelected(state: IWaterQualityState) {
      return !!state.selectedIds.length;
    },
    rowCount(state: IWaterQualityState) {
      return state.data ? state.data.length : 0;
    },
    errors(state: IWaterQualityState) {
      const errors: string[] = [];
      if (state.selectedDepth.option === DepthOptions.DepthInterval) {
        const start = state.selectedDepth.start;
        const end = state.selectedDepth.end;
        if (start === undefined) {
          errors.push('$missingDepthStart');
        }
        if (end === undefined) {
          errors.push('$missingDepthEnd');
        } else if (start && start > end) {
          errors.push('$depthStartGreaterThanDepthEnd');
        }
      }
      return errors;
    },
    toggleSelected(state: IWaterQualityState) {
      state.isSelected = !state.isSelected;
    },
    setSelectedOptions(state: IWaterQualityState, ids: number[]) {
      state.selectedIds = ids;
    },
    selectAll(state: IWaterQualityState) {
      state.options.forEach((option) => {
        if (!state.selectedIds.includes(option.id)) {
          state.selectedIds.push(option.id);
        }
      });
    },
    deSelectAll(state: IWaterQualityState) {
      state.selectedIds = [];
    },
    startLoading(state: IWaterQualityState) {
      state.loading = true;
    },
    stopLoading(state: IWaterQualityState) {
      state.loading = false;
    },
    setAvailableOptions(
      state: IWaterQualityState,
      newOptions: IAttributeOption[]
    ) {
      state.availableOptions = newOptions;
    },
    setData(state: IWaterQualityState, newData: IResponseFormat[]) {
      state.data = newData;
    },
  },
  actions: {
    async getOptions({
      commit,
      state,
    }: {
      commit: Commit;
      state: IWaterQualityState;
    }) {
      if (state.options.length === 0) {
        commit('startLoading');
        const options = await getWaterQualityOptions();

        const lang = i18n.global.locale;
        const availableOptions = options.map((o) => ({
          id: o.id,
          name:
            lang === 'fi' ? o.name_fi : lang === 'sv' ? o.name_sv : o.name_en,
          online: true,
        }));

        commit(
          'setAvailableOptions',
          availableOptions.sort((a, b) => alphabeticCompare(a.name, b.name))
        );

        commit('stopLoading');
      }
    },
    async getAvailableVeslaSiteIds(
      { commit, state }: { commit: Commit; state: IWaterQualityState },
      params: CommonParameters
    ) {
      commit('startLoading');
      const res = await getWaterQualitySiteIds(
        params,
        state.selectedIds,
        state.selectedDepth
      );
      commit('stopLoading');
      return res;
    },
    async getData(
      { commit, state }: { commit: Commit; state: IWaterQualityState },
      params: CommonParameters
    ) {
      commit('startLoading');
      const data = await getWaterQuality(
        params,
        state.selectedIds,
        state.selectedDepth
      );
      commit('setData', data);
      commit('stopLoading');
    },
  },
};
