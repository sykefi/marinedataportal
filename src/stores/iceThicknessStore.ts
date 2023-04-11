import { IAttributeStoreState } from './types/IAttributeStoreState';
import { SiteTypes } from '@/queries/site';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getObservations,
  getObservationSiteIds,
} from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { defineStore } from 'pinia';

type IIceThicknessState = IAttributeStoreState & {
  obsCode: string;
};

export const useIceThicknessStore = defineStore('iceThickness', {
  state: (): IIceThicknessState => ({
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null,
    siteTypes: [SiteTypes.Vesla],
    obsCode: 'THICKI',
  }),
  getters: {
    rowCount(state: IIceThicknessState) {
      return state.data ? state.data.length : 0;
    },
    previewData(state: IIceThicknessState) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true;
      this.data = await getObservations(params, this.obsCode);
      this.loading = false;
    },
    async getAvailableVeslaSiteIds(
      { state }: { state: IIceThicknessState },
      params: CommonParameters
    ) {
      state.loading = true;
      const res = await getObservationSiteIds(params, state.obsCode);
      state.loading = false;
      return res;
    },
    toggleSelected() {
      this.isSelected = !this.isSelected;
    },
  },
});
