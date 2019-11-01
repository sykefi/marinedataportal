<template>
  <div>
    <SelectionHeader :header="$t('$siteSelectionTitle')" />
    <div class="multiselect">
      <select v-model="selected" @change="onSelectSite($event.target.value)">
        <option :value="disabledOption" disabled hidden>{{$t('$sitePlaceholder')}}</option>
        <option v-for="site in sites" v-bind:key="site.id" :value="site.id">{{site.name}}</option>
      </select>
      <div v-if="selectedSites.length > 0" class="selection-content inline">
        <div v-for="selectedSite in selectedSites" :key="selectedSite.id" class="list-item">
          {{selectedSite.name}}
          <button
            class="invisible"
            @click="onRemoveSite(selectedSite)"
            :aria-label="$t('$remove') + selectedSite.name"
          >
            <font-awesome-icon icon="times" class="remove-button" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
.multiselect {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 2rem;
}
select {
  font-family: "TitilliumWeb";
  font-size: $font-size-m;
  height: 2.2rem;
  padding: 0.2rem;
}
.invisible {
  background: transparent;
  border: none;
  width: auto;
  height: auto;
}
.remove-button {
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

</style>

<script src="./siteSelection.ts"></script>
