import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import store from './store';
import { Site } from '@/queries/site';
import { getVeslaSites } from '@/queries/Vesla/getVeslaSitesQuery';
import { CommonParameters } from '@/queries/commonParameters';

@Module({ generateMutationSetters: true })
class SearchParameterModule extends VuexModule {
    // state
    public selectedDepth: string = 'surfaceLayer';
    public depthStart: number | null = null;
    public depthEnd: number | null = null;
    public timeSpanStart: Date | null = null;
    public timeSpanEnd: Date | null = new Date();
    public periodStart: Date | null = null;
    public periodEnd: Date | null = null;
    public availableSites: Site[] = [];
    public selectedSites: Site[] = [];
    public availableVeslaSiteIds: number[] = [];
    public loading = false;

    get parameters() {
        return new CommonParameters(this.timeSpanStart!, this.timeSpanEnd!, this.selectedSites);
    }

    // mutations

    /** Stores a VESLA site id that has some data that the user is interested in.
     * These ids will be used to fetch the sites later
     */
    @Mutation
    public storeAvailableVeslaSiteId(id: number) {
        if (!this.availableVeslaSiteIds.find((s) => s === id)) {
            this.availableVeslaSiteIds.push(id);
        }
    }

    @Mutation
    public selectedSite(id: number) {
        const site = this.availableSites.find((s) => s.id === id);
        if (site) {
            this.selectedSites.push(site);
        }
    }

    @Mutation
    public removeSite(site: Site) {
        const index = this.selectedSites.findIndex((s) => s === site);
        if (index >= 0) {
            this.selectedSites.splice(index, 1);
        }
    }

    @Action
    public async populateAvailableSites() {
        this.loading = true;
        this.availableSites = await getVeslaSites(this.availableVeslaSiteIds);
        this.loading = false;
    }
}

export const searchParameterModule = new SearchParameterModule({
    store,
    name: 'searchParameters',
});
