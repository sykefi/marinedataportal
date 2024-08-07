import { SiteTypes } from '@/queries/site'
import { CommonParameters } from '@/queries/commonParameters'
import { getWaterLevels } from '@/queries/FMI/getWaterLevelQuery'
import { PREVIEW_ROW_COUNT } from '@/config'
import { toFmiFormat } from '@/helpers'
import { IResponseFormat } from '@/queries/IResponseFormat'
import { defineStore } from 'pinia'
import { IAttributeStoreState } from './types/IAttributeStoreState'

export const useWaterLevelStore = defineStore('waterLevel', {
  state: (): IAttributeStoreState => ({
    name: '$waterLevel',
    hasOptionsSelected: true,
    loading: false,
    isSelected: false,
    data: null as IResponseFormat[] | null,
    siteTypes: [SiteTypes.Mareograph],
  }),
  getters: {
    rowCount(state) {
      return state.data ? state.data.length : 0
    },
    previewData(state) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : []
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true
      this.data = []
      const pages = getWaterLevels(params)
      for await (const page of pages) {
        this.data.push(...page.map((r) => toFmiFormat(r, 'Water level', 'mm')))
      }
      this.loading = false
    },
    toggleSelected() {
      this.isSelected = !this.isSelected
    },
  },
})
