import { IAttributeModule } from './IAttributeModule';
import { SiteTypes } from '@/queries/site';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getObservations,
  getObservationSiteIds,
} from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';

type IIceThicknessState = IAttributeModule & {
  obsCode: string;
};

export const IceThicknessModule = {
  state: () => ({
    hasOptionsSelected: true,
    name: '$iceThickness',
    loading: false,
    isSelected: false,
    data: null as IResponseFormat[] | null,
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
  mutations: {
    toggleSelected(state: IIceThicknessState) {
      state.isSelected = !state.isSelected;
    },
  },
  actions: {
    async getData(
      { state }: { state: IIceThicknessState },
      params: CommonParameters
    ) {
      state.loading = true;
      state.data = await getObservations(params, state.obsCode);
      state.loading = false;
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
  },
};
