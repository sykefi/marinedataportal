<template>
  <div>
    <SelectionHeader :header="$t('$siteSelectionTitle')" />
    <button class="download-button" @click="populate">
      {{ $t('$refreshSites') }}
    </button>
    <p class="error" v-if="showSiteRequiredError">
      {{ $t('$noSitesSelected') }}
    </p>
    <div v-if="availableSites.length">
      <p class="info-paragraph">
        {{ $t('$siteSelectionInfo') }}
      </p>
      <div id="map-wrapper">
        <div class="multiselect" id="site-selection">
          <select
            v-model="selectedId"
            @change="onSelectSite(+($event.target as HTMLSelectElement).value)"
            :aria-label="$t('$sitePlaceholder')"
          >
            <option :value="0" disabled hidden>
              {{ $t('$sitePlaceholder') + ' (' + availableSites.length + ')' }}
            </option>
            <option
              v-for="site in unSelectedSites"
              :key="site.id"
              :value="site.id"
              v-html="site.displayName"
            />
          </select>
          <div v-if="selectedSites.length" class="selection-content">
            <div
              v-for="selectedSite in selectedSites"
              :key="selectedSite.id"
              class="list-item"
              :title="selectedSite.name"
            >
              <button
                class="remove-button"
                @click="onRemoveSite(selectedSite.id)"
                :aria-label="$t('$remove') + selectedSite.name"
              >
                <font-awesome-icon icon="times" />
              </button>
              <span v-html="selectedSite.displayName" />
            </div>
          </div>
        </div>
        <div id="map">
          <SiteMap ref="mapView" />
        </div>
      </div>
    </div>
    <p class="error" v-else-if="showNoSitesMessage">
      {{ $t('$noAvailableSites') }}
    </p>
  </div>
</template>

<script lang="ts">
import SelectionHeader from '@/components/common/SelectionHeader.vue'
import SiteMap from '@/components/siteSelection/SiteMap.vue'
import { validateSearchParameters } from '@/helpers'
import { useMainStateStore } from '@/stores/mainStateStore'
import { useSearchParameterStore } from '@/stores/searchParameterStore'
import { useWaterQualityStore } from '@/stores/waterQualityStore'
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    SelectionHeader,
    SiteMap,
  },
  data() {
    return {
      selectedId: 0,
      showNoSitesMessage: false,
    }
  },
  computed: {
    ...mapStores(
      useSearchParameterStore,
      useMainStateStore,
      useWaterQualityStore
    ),
    availableSites() {
      return this.searchParameterStore.availableSites
    },
    selectedSites() {
      return this.searchParameterStore.selectedSites
    },
    unSelectedSites() {
      return this.searchParameterStore.availableSites.filter(
        (s) => !this.selectedSites.find((ss) => ss.id === s.id)
      )
    },
    showSiteRequiredError() {
      return this.mainStateStore.isError('$noSitesSelected')
    },
  },
  methods: {
    onSelectSite(id: number) {
      this.searchParameterStore.selectSite(id)
      this.selectedId = 0
      ;(this.$refs.mapView as any).addSelection(id)
    },
    onRemoveSite(id: number) {
      this.searchParameterStore.removeSite(id)
      ;(this.$refs.mapView as any).removeSelection(id)
    },
    async populate() {
      this.showNoSitesMessage = false
      const errors = [...this.waterQualityStore.errors]
      errors.push(
        ...validateSearchParameters(
          false,
          this.searchParameterStore.selectedSites,
          this.mainStateStore.selectedAttributeStores,
          this.searchParameterStore.timeSpanStart,
          this.searchParameterStore.timeSpanEnd,
          this.searchParameterStore.periodStart,
          this.searchParameterStore.periodEnd
        )
      )
      if (errors.length === 0) {
        this.searchParameterStore.clearSelectedSites()
        if (this.$refs.mapView) {
          ;(this.$refs.mapView as any).clearSelectedFeatures()
        }
        await this.mainStateStore.populateAvailableSites(
          this.searchParameterStore.parameters
        )
        setTimeout(() => (this.showNoSitesMessage = true), 500) // There is a short slag before availableSites is populated
      }
      this.mainStateStore.setErrorList(errors)
    },
  },
})
</script>

<style lang="scss">
@import '@/assets/styles/variables.scss';
#map-wrapper {
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-template-areas: 'selection map';
  grid-gap: 0.5rem;
  border: 1px solid $border-gray;
  height: 40rem;

  #map {
    grid-area: map;
  }

  #site-selection {
    grid-area: selection;
  }
}

.multiselect {
  overflow-y: auto;
  overflow-x: hidden;
  select {
    font-family: 'TitilliumWeb';
    font-size: $font-size-m;
    height: 2.2rem;
    padding: 0.2rem;
    margin-top: 1.5rem;
    max-width: 12rem;
  }
  .remove-button {
    border: none;
    width: auto;
    height: auto;
    background: transparent;
    color: $background-remove;
  }

  .selection-content {
    .list-item {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .inline {
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
