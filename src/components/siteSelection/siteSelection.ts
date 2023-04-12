import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import SiteMap from '@/components/siteSelection/SiteMap.vue';
import { validateSearchParameters } from '@/helpers';
import { useMainStateStore } from '@/stores/mainStateStore';
import { useSearchParameterStore } from '@/stores/searchParameterStore';
import { useWaterQualityStore } from '@/stores/waterQualityStore';
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    SelectionHeader,
    SelectionButton,
    SiteMap,
  },
  data() {
    return {
      selectedId: 0,
      showNoSitesMessage: false,
    };
  },
  computed: {
    ...mapStores(
      useSearchParameterStore,
      useMainStateStore,
      useWaterQualityStore
    ),
    availableSites() {
      return this.searchParameterStore.availableSites;
    },
    selectedSites() {
      return this.searchParameterStore.selectedSites;
    },
    unSelectedSites() {
      return this.searchParameterStore.availableSites.filter(
        (s) => !this.selectedSites.find((ss) => ss.id === s.id)
      );
    },
    showSiteRequiredError() {
      return this.mainStateStore.isError('$noSitesSelected');
    },
  },
  methods: {
    onSelectSite(id: number) {
      this.searchParameterStore.selectSite(id);
      this.selectedId = 0;
      (this.$refs.mapView as any).addSelection(id);
    },
    onRemoveSite(id: number) {
      this.searchParameterStore.removeSite(id);
      (this.$refs.mapView as any).removeSelection(id);
    },
    async populate() {
      this.showNoSitesMessage = false;
      const errors = [...this.waterQualityStore.errors];
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
      );
      if (errors.length === 0) {
        this.searchParameterStore.clearSelectedSites();
        if (this.$refs.mapView) {
          (this.$refs.mapView as any).clearSelectedFeatures();
        }
        await this.mainStateStore.populateAvailableSites(
          this.searchParameterStore.parameters
        );
        setTimeout(() => (this.showNoSitesMessage = true), 500); // There is a short slag before availableSites is populated
      }
      this.mainStateStore.setErrorList(errors);
    },
  },
});
