import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { Site } from '@/queries/site';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
import { validateSearchParameters } from '@/helpers';
@Component({
  components: {
    SelectionHeader,
    SelectionButton,
  },
})
export default class SiteSelection extends Vue {
  public selectedId = 0;

  get selectedSites() {
    return searchParameterModule.selectedSites;
  }

  get unSelectedSites() {
    return searchParameterModule.availableSites.filter((s) =>
      !(this.selectedSites.find((ss) => ss.id === s.id)
      ));
  }

  public onSelectSite(id: number) {
    searchParameterModule.selectedSite(id);
    this.selectedId = 0; // reset selection to placeholder
  }

  public onRemoveSite(site: Site) {
    searchParameterModule.removeSite(site);
  }

  public populate() {
    if (validateSearchParameters()) {
      mainState.populateAvailableSites(searchParameterModule.parameters);
    }
  }
}
