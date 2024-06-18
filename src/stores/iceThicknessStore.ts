import { SiteTypes } from '@/queries/site'
import { CommonParameters } from '@/queries/commonParameters'
import {
  getObservations,
  getObservationSiteIds,
} from '@/queries/Vesla/getObservationsQuery'
import { PREVIEW_ROW_COUNT } from '@/config'
import { defineStore } from 'pinia'
import { IAttributeStoreState } from './types/IAttributeStoreState'

type IIceThicknessState = IAttributeStoreState & {
  obsCode: string
}

export const useIceThicknessStore = defineStore('iceThickness', {
  state: (): IIceThicknessState => ({
    name: '$iceThickness',
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null,
    siteTypes: [SiteTypes.Vesla],
    obsCode: 'THICKI',
  }),
  getters: {
    rowCount(state: IIceThicknessState) {
      return state.data ? state.data.length : 0
    },
    previewData(state: IIceThicknessState) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : []
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true
      this.data = []
      const pages = getObservations(params, this.obsCode)
      for await (const page of pages) {
        this.data.push(...page)
      }
      this.loading = false
    },
    async getAvailableVeslaSiteIds(params: CommonParameters) {
      this.loading = true
      const res = await getObservationSiteIds(params, this.obsCode)
      this.loading = false
      return res
    },
    toggleSelected() {
      this.isSelected = !this.isSelected
    },
  },
})
