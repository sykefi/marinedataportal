import { SiteTypes } from '@/queries/site';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getObservations,
  getObservationSiteIds,
} from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { defineStore } from 'pinia';
import { IAttributeStoreState } from './types/IAttributeStoreState';

type ISecchiDepthState = IAttributeStoreState & {
  obsCode: string;
};

export const useSecchiDepthStore = defineStore('secchiDepth', {
  state: (): ISecchiDepthState => ({
    name: '$secchiDept',
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null,
    siteTypes: [SiteTypes.Vesla],
    obsCode: 'SDT',
  }),
  getters: {
    rowCount(state) {
      return state.data ? state.data.length : 0;
    },
    previewData(state) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true;
      const res = await getObservations(params, this.obsCode);
      this.setData(res);
      this.loading = false;
    },
    async getAvailableVeslaSiteIds(params: CommonParameters) {
      this.loading = true;
      const res = await getObservationSiteIds(params, this.obsCode);
      this.loading = false;
      return res;
    },
    toggleSelected() {
      this.isSelected = !this.isSelected;
    },
    setData(newData: IResponseFormat[]) {
      this.data = newData;
    },
  },
});
