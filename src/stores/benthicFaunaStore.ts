import { SiteTypes } from '@/queries/site'
import { PREVIEW_ROW_COUNT } from '@/config'
import { IResponseFormat } from '@/queries/IResponseFormat'
import { defineStore } from 'pinia'
import { IAttributeStoreState } from './types/IAttributeStoreState'

export const useBenthicFaunaStore = defineStore('benthicFauna', {
  state: (): IAttributeStoreState => ({
    name: '$benthicFauna',
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null,
    siteTypes: [SiteTypes.Vesla],
  }),
  getters: {
    previewData(state): IResponseFormat[] {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : []
    },
    rowCount(state): number {
      return state.data ? state.data.length : 0
    },
  },
  actions: {
    toggleSelected() {
      this.isSelected = !this.isSelected
    },
  },
})
