
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import SelectionButton from '@/components/common/selectionButton/SelectionButton.vue';
import { Site } from '@/components/siteSelection/site';
import { attributeModule } from '@/store/attributeModule';
@Component({
  components: {
    SelectionHeader,
    SelectionButton,
  },
})
export default class SiteSelection extends Vue {
  public disabledOption = new Site('', '');
  public selected: Site = this.disabledOption;
  public selectedSites: Site[] = attributeModule.selectedSites;
  public sites = [new Site('70666', 'LL7'), new Site('12499', 'Ahvenkoskenlahti'),
  new Site('30372', 'Hailuoto'), new Site('59053', 'Brändö'), new Site('3435', 'Vanhankaupunginselkä')]; // TODO: hae tietokannasta

  public onSelectSite(id: string) {
    const selectedSite = this.sites.find((s) => s.id === id);
    if (selectedSite) {
      attributeModule.addSelectedSite(selectedSite);
    }
    this.selected = this.disabledOption;
    this.removeSite(this.sites, id);
  }

  public onRemoveSite(site: Site) {
    this.sites.push(site);
    this.sites.sort(this.sortAlphabetically);
    attributeModule.removeSite(site);
  }

  private removeSite(siteList: Site[], id: string) {
    const index = siteList.findIndex((s) => s.id === id);
    if (index >= 0) {
      siteList.splice(index, 1);
    }
  }

  private sortAlphabetically(a: Site, b: Site) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }
}