<template>
  <div>
    <SelectionHeader :header="$t('$siteSelectionTitle')" />
    <button class="download-button small-button" @click="populate">
      {{ $t("$refreshSites") }}
    </button>
    <div v-if="availableSites.length">
      <p class="info-paragraph">{{ $t("$siteSelectionInfo") }}</p>
      <div class="map-wrapper">
        <Map ref="mapView" />
      </div>
      <div class="multiselect">
        <select
          v-model="selectedId"
          @change="onSelectSite(+$event.target.value)"
        >
          <option :value="0" disabled hidden>{{
            $t("$sitePlaceholder")
          }}</option>
          <option
            v-for="site in unSelectedSites"
            v-bind:key="site.id"
            :value="site.id"
            >{{ site.name }}</option
          >
        </select>
        <div v-if="selectedSites.length" class="selection-content inline">
          <div
            v-for="selectedSite in selectedSites"
            :key="selectedSite.id"
            class="list-item"
          >
            {{ selectedSite.name }}
            <button
              class="remove-button"
              @click="onRemoveSite(selectedSite.id)"
              :aria-label="$t('$remove') + selectedSite.name"
            >
              <font-awesome-icon icon="times" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <p class="error" v-else-if="showMessage">{{ $t("$noAvailableSites") }}</p>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.multiselect {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin: 2rem 0;
}
select {
  font-family: "TitilliumWeb";
  font-size: $font-size-m;
  height: 2.2rem;
  padding: 0.2rem;
}
.remove-button {
  border: none;
  width: auto;
  height: auto;
  background: transparent;
  color: $background-remove;
}
.site-header {
  font-weight: bold;
  margin-left: 2rem;
}
.list-item {
  margin-left: 2rem;
}
.inline {
  display: flex;
  flex-wrap: wrap;
}
.map-wrapper {
  border: 1px solid $border-gray;
}

.small-button {
  font-size: $font-size-l;
  font-weight: normal;
  padding: 0 1rem 0 1rem;
  height: 3rem;
}
</style>

<script src="./siteSelection.ts"></script>
