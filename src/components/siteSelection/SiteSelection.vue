<template>
  <div>
    <SelectionHeader :header="$t('$siteSelectionTitle')" />
    <button class="download-button small-button" @click="populate">{{ $t("$refreshSites") }}</button>
    <p class="error" v-if="showSiteRequiredError">{{$t('$noSitesSelected')}}</p>
    <div v-if="availableSites.length">
      <p class="info-paragraph">{{ $t("$siteSelectionInfo") }}</p>
      <div id="map-wrapper">
        <div class="multiselect" id="site-selection">
          <select v-model="selectedId" @change="onSelectSite(+$event.target.value)">
            <option :value="0" disabled hidden>{{ $t("$sitePlaceholder") }}</option>
            <option
              v-for="site in unSelectedSites"
              v-bind:key="site.id"
              :value="site.id"
              v-html="site.displayName"
            ></option>
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
          <Map ref="mapView" />
        </div>
      </div>
    </div>
    <p class="error" v-else-if="showNoSitesMessage">{{ $t("$noAvailableSites") }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
#map-wrapper {
  display: grid;
  grid-template-columns: 15rem 1fr;
  grid-template-areas: "selection map";
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
    font-family: "TitilliumWeb";
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

.small-button {
  font-size: $font-size-l;
  font-weight: normal;
  padding: 0 1rem 0 1rem;
  height: 3rem;
}
</style>

<script src="./siteSelection.ts"></script>
