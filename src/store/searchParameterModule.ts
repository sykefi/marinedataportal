import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import store from './store';
import { Site } from '@/queries/site';
import { getVeslaSites } from '@/queries/Vesla/getVeslaSitesQuery';
import { CommonParameters } from '@/queries/commonParameters';
import { ITimeSpanSelection } from './ITimeSpanSelection';

export enum DepthOptions {
    SurfaceLayer,
    SeaFloorLayer,
    DepthInterval,
}

@Module({ generateMutationSetters: true })
class SearchParameterModule extends VuexModule {
    // state
    public selectedDepth: DepthOptions = DepthOptions.SeaFloorLayer;
    public depthStart: number | null = null;
    public depthEnd: number | null = null;
    public timeSpanStart: Date | null = null;
    public timeSpanEnd: Date | null = new Date();
    public periodStart: ITimeSpanSelection | null = null;
    public periodEnd: ITimeSpanSelection | null = null;
    public availableSites: Site[] = [];
    public selectedSites: Site[] = [];
    public loading = false;

    get parameters() {
        return new CommonParameters();
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
        this.availableSites = await getVeslaSites(veslaIds);
        this.loading = false;
    }
}

export const searchParameterModule = new SearchParameterModule({
    store,
    name: 'searchParameters',
});
