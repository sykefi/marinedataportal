import { IAttributeModule } from './IAttributeModule';
import { SiteTypes } from '@/queries/site';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';

export const PhytoPlanktonModule = {
  state: () => ({
    hasOptionsSelected: true,
    name: '$phytoPlankton',
    loading: false,
    isSelected: false,
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.Vesla],
  }),
  getters: {
    previewData(state: IAttributeModule) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
    rowCount(state: IAttributeModule) {
      return state.data ? state.data.length : 0;
    },
  },
  mutations: {
    toggleSelected(state: IAttributeModule) {
      state.isSelected = !state.isSelected;
    },
  },
  actions: {
    async getData() {
      throw new Error('Method not implemented.');
    },
    async getAvailableVeslaSiteIds() {
      throw new Error('Method not implemented.');
    },
  },
};
