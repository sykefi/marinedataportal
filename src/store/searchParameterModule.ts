import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import store from './store';
import { Site, SiteTypes } from '@/queries/site';
import { getVeslaSites } from '@/queries/Vesla/getVeslaSitesQuery';
import { CommonParameters } from '@/queries/commonParameters';
import { getMareographs } from '@/queries/FMI/getMareographsQuery';
import { alphabeticCompare } from '@/helpers';
import { mainState } from './mainState';
import { getBuoys } from '@/queries/FMI/getBuoysQuery';
import { DatePickerResult } from '@/components/common/datePicker/datePicker';

@Module({ generateMutationSetters: true })
export class SearchParameterModule extends VuexModule {
    // state
    public timeSpanStart: DatePickerResult = null;
    public timeSpanEnd: DatePickerResult = new Date(Date.UTC(new Date().getFullYear(),
                        new Date().getMonth(), new Date().getDate(), 0, 0, 0));
    public periodStart: DatePickerResult = null;
    public periodEnd: DatePickerResult = null;
    public availableSites: Site[] = [];
    public selectedSites: Site[] = [];
    public loading = false;

    get parameters() {
        return new CommonParameters(this.timeSpanStart, this.timeSpanEnd,
            this.periodStart, this.periodEnd, this.selectedSites);
    }

    // mutations
    @Mutation
    public selectSite(id: number) {
        if (this.selectedSites.find((s) => s.id === id)) {
            return;
        }
        const site = this.availableSites.find((s) => s.id === id);
        if (site) {
            this.selectedSites.push(site);
            this.selectedSites.sort((a, b) => alphabeticCompare(a.name, b.name));
        }
    }

    @Mutation
    public removeSite(id: number) {
        const index = this.selectedSites.findIndex((s) => s.id === id);
        if (index >= 0) {
            this.selectedSites.splice(index, 1);
        }
    }

    @Mutation
    public clearSelectedSites() {
        this.selectedSites = [];
    }

    @Action
    public async populateAvailableSites(veslaIds: number[]) {
        this.loading = true;
        let sites: Site[] = [];
        const siteTypes = mainState.selectedSiteTypes;
        if (siteTypes.includes(SiteTypes.Vesla)) {
            sites = await getVeslaSites(veslaIds);
        }
        if (siteTypes.includes(SiteTypes.Mareograph)) {
            sites.push(...await getMareographs());
        }
        if (siteTypes.includes(SiteTypes.FmiBuoy)) {
            sites.push(...await getBuoys());
        }
        sites.sort((s1, s2) => alphabeticCompare(s1.name, s2.name));
        this.availableSites = sites;
        this.loading = false;
    }
}

export const searchParameterModule = new SearchParameterModule({
    store,
    name: 'searchParameters',
});
