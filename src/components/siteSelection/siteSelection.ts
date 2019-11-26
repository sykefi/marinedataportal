import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import Map from '@/components/siteSelection/Map.vue';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
import { validateSearchParameters } from '@/helpers';

@Component({
  components: {
    SelectionHeader,
    SelectionButton,
    Map,
  },
})
export default class SiteSelection extends Vue {
  public selectedId = 0;
  public showMessage = false;

  get availableSites() {
    return searchParameterModule.availableSites;
  }

  get selectedSites() {
    return searchParameterModule.selectedSites;
  }

  get unSelectedSites() {
    return searchParameterModule.availableSites.filter((s) =>
      !(this.selectedSites.find((ss) => ss.id === s.id)
      ));
  }

  public onSelectSite(id: number) {
    searchParameterModule.selectSite(id);
    this.selectedId = 0; // reset selection to placeholder
  }

  public onRemoveSite(id: number) {
    searchParameterModule.removeSite(id);
    (this.$refs.mapView as any).removeSelection(id);
  }

  public async populate() {
    this.showMessage = false;
    if (validateSearchParameters()) {
      searchParameterModule.clearSelectedSites();
      await mainState.populateAvailableSites(searchParameterModule.parameters);
      setTimeout(() => this.showMessage = true, 500); // There is a short slag before availableSites is populated
    }
  }
}
