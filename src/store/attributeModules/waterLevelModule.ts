import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
import { SiteTypes } from '@/queries/site';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterLevels } from '@/queries/FMI/getWaterLevelQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { Commit } from 'vuex';

export const WaterLevelModule = {
  state: () => ({
    hasOptionsSelected: true,
    name: '$waterLevel',
    loading: false,
    isSelected: false,
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.Mareograph],
  }),
  getters: {
    rowCount(state: IAttributeModule) {
      return state.data ? state.data.length : 0;
    },
    previewData(state: IAttributeModule) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
  },
  mutations: {
    toggleSelected(state: IAttributeModule) {
      state.isSelected = !state.isSelected;
    },
    startLoading(state: IAttributeModule) {
      state.loading = true;
    },
    stopLoading(state: IAttributeModule) {
      state.loading = false;
    },
    setData(state: IAttributeModule, newData: IResponseFormat[]) {
      state.data = newData;
    },
  },
  actions: {
    async getData({ commit }: { commit: Commit }, params: CommonParameters) {
      commit('startLoading');
      const results = await getWaterLevels(params);
      const inFmiFormat = results.map((r) =>
        toFmiFormat(r, 'Water level', 'mm')
      );
      commit('setData', inFmiFormat);
      commit('stopLoading');
    },
    async getAvailableVeslaSiteIds() {
      return [];
    },
  },
};
