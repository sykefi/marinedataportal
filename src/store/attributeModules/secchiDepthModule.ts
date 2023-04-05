import { IAttributeModule } from './IAttributeModule';
import { SiteTypes } from '@/queries/site';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getObservations,
  getObservationSiteIds,
} from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { Commit } from 'vuex';

type ISecchiDepthState = IAttributeModule & {
  obsCode: string;
};

export const SecchiDepthModule = {
  state: () => ({
    hasOptionsSelected: true,
    name: '$secchiDepth',
    loading: false,
    isSelected: false,
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.Vesla],
    obsCode: 'SDT',
  }),
  getters: {
    rowCount(state: ISecchiDepthState) {
      return state.data ? state.data.length : 0;
    },
    previewData(state: ISecchiDepthState) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : [];
    },
  },
  mutations: {
    toggleSelected(state: ISecchiDepthState) {
      state.isSelected = !state.isSelected;
    },
    startLoading(state: ISecchiDepthState) {
      state.loading = true;
    },
    stopLoading(state: ISecchiDepthState) {
      state.loading = false;
    },
    setData(state: ISecchiDepthState, newData: IResponseFormat[]) {
      state.data = newData;
    },
  },
  actions: {
    async getData(
      { commit, state }: { commit: Commit; state: ISecchiDepthState },
      params: CommonParameters
    ) {
      commit('startLoading');
      commit('setData', await getObservations(params, state.obsCode));
      commit('stopLoading');
    },
    async getAvailableVeslaSiteIds(
      { commit, state }: { commit: Commit; state: ISecchiDepthState },
      params: CommonParameters
    ) {
      commit('startLoading');
      const res = await getObservationSiteIds(params, state.obsCode);
      commit('stopLoading');
      return res;
    },
  },
};
