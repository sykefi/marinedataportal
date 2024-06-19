import { Site, SiteTypes } from '@/queries/site'
import { getVeslaSites } from '@/queries/Vesla/getVeslaSitesQuery'
import { CommonParameters } from '@/queries/commonParameters'
import { getMareographs } from '@/queries/FMI/getMareographsQuery'
import { alphabeticCompare } from '@/helpers'
import { getBuoys } from '@/queries/FMI/getBuoysQuery'
import { DatePickerResult } from '@/components/common/DatePicker.vue'
import { defineStore } from 'pinia'
import { useMainStateStore } from './mainStateStore'

type ISearchParameterStoreState = {
  timeSpanStart: DatePickerResult | null
  timeSpanEnd: DatePickerResult
  periodStart: DatePickerResult | null
  periodEnd: DatePickerResult | null
  availableSites: Site[]
  selectedSites: Site[]
  loading: boolean
}

export const useSearchParameterStore = defineStore('searchParameter', {
  state: (): ISearchParameterStoreState => ({
    timeSpanStart: null,
    timeSpanEnd: new Date(
      Date.UTC(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        0,
        0,
        0
      )
    ),
    periodStart: null,
    periodEnd: null,
    availableSites: [],
    selectedSites: [],
    loading: false,
  }),
  getters: {
    parameters(state) {
      return new CommonParameters(
        state.timeSpanStart,
        state.timeSpanEnd,
        state.periodStart,
        state.periodEnd,
        state.selectedSites
      )
    },
  },
  actions: {
    setTimeSpanStart(payload: DatePickerResult | null) {
      this.timeSpanStart = payload
    },
    setTimeSpanEnd(payload: DatePickerResult) {
      this.timeSpanEnd = payload
    },
    setPeriodStart(payload: DatePickerResult | null) {
      this.periodStart = payload
    },
    setPeriodEnd(payload: DatePickerResult | null) {
      this.periodEnd = payload
    },
    selectSite(id: number) {
      if (this.selectedSites.find((s) => s.id === id)) {
        return
      }
      const site = this.availableSites.find((s) => s.id === id)
      if (site) {
        this.selectedSites.push(site)
        this.selectedSites.sort((a, b) => alphabeticCompare(a.name, b.name))
      }
    },
    removeSite(id: number) {
      const index = this.selectedSites.findIndex((s) => s.id === id)
      if (index >= 0) {
        this.selectedSites.splice(index, 1)
      }
    },
    clearSelectedSites() {
      this.selectedSites = []
    },
    async populateAvailableSites(veslaIds: number[]) {
      const mainState = useMainStateStore()
      this.loading = true
      this.availableSites = [] //reset previously loaded sites
      const siteTypes = mainState.selectedSiteTypes
      if (siteTypes.includes(SiteTypes.Vesla)) {
        const pages = getVeslaSites(veslaIds)
        for await (const sitepage of pages) {
          this.availableSites.push(...sitepage) //assumption: our API calls produce no duplicates
        }
      }
      if (siteTypes.includes(SiteTypes.Mareograph)) {
        this.availableSites.push(...(await getMareographs()))
      }
      if (siteTypes.includes(SiteTypes.FmiBuoy)) {
        this.availableSites.push(...(await getBuoys()))
      }
      this.loading = false
    },
  },
})
