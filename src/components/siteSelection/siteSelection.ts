import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import SiteMap from '@/components/siteSelection/SiteMap.vue';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
import { validateSearchParameters } from '@/helpers';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';

@Component({
  components: {
    SelectionHeader,
    SelectionButton,
    SiteMap,
  },
})
export default class SiteSelection extends Vue {
  public selectedId = 0;
  public showNoSitesMessage = false;

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

  get showSiteRequiredError() {
    return mainState.isError('$noSitesSelected');
  }

  public onSelectSite(id: number) {
    searchParameterModule.selectSite(id);
    this.selectedId = 0;
    (this.$refs.mapView as any).addSelection(id);
  }

  public onRemoveSite(id: number) {
    searchParameterModule.removeSite(id);
    (this.$refs.mapView as any).removeSelection(id);
  }

  public async populate() {
    this.showNoSitesMessage = false;
    const errors = [...waterQualityModule.errors];
    errors.push(...validateSearchParameters(
      false,
      searchParameterModule.selectedSites,
      mainState.selectedAttributeModules,
      searchParameterModule.timeSpanStart,
      searchParameterModule.timeSpanEnd,
      searchParameterModule.periodStart,
      searchParameterModule.periodEnd),
    );
    if (errors.length === 0) {
      searchParameterModule.clearSelectedSites();
      if (this.$refs.mapView) {
        (this.$refs.mapView as any).clearSelectedFeatures();
      }
      await mainState.populateAvailableSites(searchParameterModule.parameters);
      setTimeout(() => this.showNoSitesMessage = true, 500); // There is a short slag before availableSites is populated
    }
    mainState.setErrorList(errors);
  }
}
