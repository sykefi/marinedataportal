import { SiteTypes } from '@/queries/site';
import { PREVIEW_ROW_COUNT } from '@/config';
import { defineStore } from 'pinia';
import { IAttributeStoreState } from './types/IAttributeStoreState';

export const usePhytoPlanktonStore = defineStore('phytoPlankton', {
  state: (): IAttributeStoreState => ({
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null,
    siteTypes: [SiteTypes.Vesla],
  }),
  getters: {
    previewData(state) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    rowCount(state) {
      return state.data ? state.data.length : 0;
    },
  },
  actions: {
    toggleSelected() {
      this.isSelected = !this.isSelected;
    },
  },
});
