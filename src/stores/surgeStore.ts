import { CommonParameters } from '@/queries/commonParameters'
import i18n from '@/locale/i18n'
import { IAttributeStoreStateWithOptions } from './types/IAttributeStoreStateWithOptions'
import { PREVIEW_ROW_COUNT } from '@/config'
import { SiteTypes } from '@/queries/site'
import {
  getWaveData,
  WaveQueryParameters,
} from '@/queries/FMI/getWaveDataQuery'
import { toFmiFormat } from '@/helpers'
import { IResponseFormat } from '@/queries/IResponseFormat'
import { defineStore } from 'pinia'

export const useSurgeStore = defineStore('surge', {
  state: (): IAttributeStoreStateWithOptions => ({
    name: '$surge',
    loading: false,
    isSelected: false,
    availableOptions: [],
    selectedIds: [],
    data: null,
    siteTypes: [SiteTypes.FmiBuoy, SiteTypes.Mareograph],
  }),
  getters: {
    rowCount(state) {
      return state.data ? state.data.length : 0
    },
    previewData(state) {
      return state.data ? state.data.slice(0, PREVIEW_ROW_COUNT) : []
    },
    hasOptionsSelected(state) {
      return !!state.selectedIds.length
    },
  },
  actions: {
    async getData(params: CommonParameters) {
      this.loading = true
      const queryParams: WaveQueryParameters[] = []
      if (this.selectedIds.includes(0)) {
        queryParams.push(WaveQueryParameters.direction)
      }
      if (this.selectedIds.includes(1)) {
        // temp
        queryParams.push(WaveQueryParameters.waterTemperature)
      }
      if (this.selectedIds.includes(2)) {
        // height
        queryParams.push(WaveQueryParameters.waveHeight)
      }
      if (this.selectedIds.includes(3)) {
        // modal period
        queryParams.push(WaveQueryParameters.modalPeriod)
      }
      if (this.selectedIds.includes(4)) {
        // deviation
        queryParams.push(WaveQueryParameters.directionDeviation)
      }

      const results = await getWaveData(params, queryParams)
      const inFmiFormat = results.map((r) => {
        let parameterName = ''
        let unit = ''
        switch (r.parameterName) {
          case WaveQueryParameters.direction:
            parameterName = 'Wave direction'
            unit = '°'
            break
          case WaveQueryParameters.directionDeviation:
            parameterName = 'Direction deviation'
            unit = '°'
            break
          case WaveQueryParameters.modalPeriod:
            parameterName = 'Modal period'
            unit = 's'
            break
          case WaveQueryParameters.waterTemperature:
            parameterName = 'Water temperature'
            unit = '°C'
            break
          case WaveQueryParameters.waveHeight:
            parameterName = 'Wave height'
            unit = 'm'
            break
          default:
            break
        }
        return toFmiFormat(r, parameterName, unit)
      })
      this.setData(inFmiFormat)
      this.loading = false
    },
    toggleSelected() {
      this.isSelected = !this.isSelected
    },
    setSelectedOptions(ids: number[]) {
      this.selectedIds = ids
    },
    selectAll() {
      this.availableOptions.forEach((option) => {
        if (!this.selectedIds.includes(option.id)) {
          this.selectedIds.push(option.id)
        }
      })
    },
    deSelectAll() {
      this.selectedIds = []
    },
    getOptions() {
      this.availableOptions = []
      const keys = [
        '$waveDirection',
        '$waterTemperature',
        '$waveHeight',
        '$modalPeriod',
        '$waveletDivergence',
      ]
      keys.forEach((key, id) => {
        this.availableOptions.push({
          id,
          name: i18n.global.t(key).toString(),
          online: true,
        })
      })
    },
    setData(newData: IResponseFormat[]) {
      this.data = newData
    },
  },
})
