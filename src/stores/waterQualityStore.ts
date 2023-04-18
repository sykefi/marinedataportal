import {
  getWaterQualityOptions,
  IWaterQualityOption,
} from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getWaterQuality,
  getWaterQualitySiteIds,
} from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './types/IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { alphabeticCompare } from '@/helpers';
import { SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import i18n from '@/locale/i18n';
import { defineStore } from 'pinia';
import { IAttributeStoreStateWithOptions } from './types/IAttributeStoreStateWithOptions';

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

type IWaterQualityState = IAttributeStoreStateWithOptions & {
  selectedDepth: IDepthSettings;
  options: IWaterQualityOption[];
};

export const useWaterQualityStore = defineStore('waterQuality', {
  state: (): IWaterQualityState => ({
    name: '$waterQuality',
    isSelected: false,
    loading: false,
    selectedIds: [],
    data: null,
    siteTypes: [SiteTypes.Vesla],
    selectedDepth: { option: DepthOptions.AllLayers },
    options: [],
    availableOptions: [],
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
    errors(state) {
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
  },
  actions: {
    async getOptions() {
      if (this.options.length === 0) {
        this.loading = true;
        const options = await getWaterQualityOptions();

        const lang = i18n.global.locale;
        const availableOptions = options.map((o) => ({
          id: o.id,
          name:
            lang === 'fi' ? o.name_fi : lang === 'sv' ? o.name_sv : o.name_en,
          online: true,
        }));

        this.setAvailableOptions(
          availableOptions.sort((a, b) => alphabeticCompare(a.name, b.name))
        );

        this.loading = false;
      }
    },
    async getAvailableVeslaSiteIds(params: CommonParameters) {
      this.loading = true;
      const res = await getWaterQualitySiteIds(
        params,
        this.selectedIds,
        this.selectedDepth
      );
      this.loading = false;
      return res;
    },
    async getData(params: CommonParameters) {
      this.loading = true;
      const data = await getWaterQuality(
        params,
        this.selectedIds,
        this.selectedDepth
      );
      this.setData(data);
      this.loading = false;
    },
    toggleSelected() {
      this.isSelected = !this.isSelected;
    },
    setSelectedOptions(ids: number[]) {
      this.selectedIds = ids;
    },
    selectAll() {
      this.options.forEach((option) => {
        if (!this.selectedIds.includes(option.id)) {
          this.selectedIds.push(option.id);
        }
      });
    },
    deSelectAll() {
      this.selectedIds = [];
    },
    setAvailableOptions(newOptions: IAttributeOption[]) {
      this.availableOptions = newOptions;
    },
    setData(newData: IResponseFormat[]) {
      this.data = newData;
    },
  },
});
