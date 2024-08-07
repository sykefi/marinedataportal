import { CommonParameters } from '@/queries/commonParameters'
import { SiteTypes } from '@/queries/site'
import { useSearchParameterStore } from './searchParameterStore'
import { defineStore } from 'pinia'
import { useBenthicFaunaStore } from './benthicFaunaStore'
import { useIceThicknessStore } from './iceThicknessStore'
import { usePhytoPlanktonStore } from './phytoPlanktonStore'
import { useSecchiDepthStore } from './secchiDepthStore'
import { useSurfaceTemperatureStore } from './surfaceTemperatureStore'
import { useWaterLevelStore } from './waterLevelStore'
import { useWaterQualityStore } from './waterQualityStore'
import { useSurgeStore } from './surgeStore'
import { IAttributeStoreProperties } from 'pinia'

interface MainState {
  errorList: string[]
  sykeApiOnline: boolean
  fmiApiOnline: boolean
  hasError: boolean
}

export const useMainStateStore = defineStore('mainState', {
  state: (): MainState => ({
    errorList: [],
    sykeApiOnline: true,
    fmiApiOnline: true,
    hasError: false,
  }),
  getters: {
    loading(): boolean {
      const searchParameterStore = useSearchParameterStore()
      const stores = this.attributeStores as IAttributeStoreProperties[]
      return searchParameterStore.loading || !!stores.find((s) => s.loading)
    },
    selectedAttributeStores() {
      const stores = this.attributeStores as IAttributeStoreProperties[]
      return stores.filter((s) => s.isSelected && s.hasOptionsSelected)
    },
    selectedSiteTypes() {
      const allSiteTypes: SiteTypes[] = []
      this.selectedAttributeStores.forEach((a) => {
        allSiteTypes.push(...a.siteTypes)
      })
      return [...new Set(allSiteTypes)]
    },
    attributeStores(): IAttributeStoreProperties[] {
      return [
        useBenthicFaunaStore(),
        useIceThicknessStore(),
        usePhytoPlanktonStore(),
        useSecchiDepthStore(),
        useSurfaceTemperatureStore(),
        useSurgeStore(),
        useWaterLevelStore(),
        useWaterQualityStore(),
      ]
    },
  },
  actions: {
    setErrorList(errors: string[]) {
      this.errorList = errors
    },
    setError(hasError: boolean) {
      this.hasError = hasError
    },
    setSykeApiOnlineStatus(isOnline: boolean) {
      this.sykeApiOnline = isOnline
    },
    setFmiApiOnlineStatus(isOnline: boolean) {
      this.fmiApiOnline = isOnline
    },
    isError(name: string) {
      return this.errorList.includes(name)
    },
    async populateSelectionOptions() {
      this.attributeStores.forEach((store) => {
        if (store.getOptions) {
          store.getOptions()
        }
      })
    },
    async populateAvailableSites(params: CommonParameters) {
      const veslaIds: number[] = []
      for (const store of this.selectedAttributeStores) {
        const ids = store.getAvailableVeslaSiteIds
          ? await store.getAvailableVeslaSiteIds(params)
          : []
        veslaIds.push(...ids)
      }
      const searchParameterStore = useSearchParameterStore()
      // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
      searchParameterStore.populateAvailableSites([...new Set(veslaIds)])
    },
    async downloadData() {
      const searchParameterStore = useSearchParameterStore()
      this.attributeStores.forEach((store) => {
        store.data = null
        if (store.isSelected && store.hasOptionsSelected && store.getData) {
          store.getData(searchParameterStore.parameters)
        }
      })
    },
  },
})
