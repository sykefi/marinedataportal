import { Module, Mutation, VuexModule } from 'vuex-class-modules';
import store from './store';
import { Site } from '@/components/siteSelection/site';
@Module
class SearchParameterModule extends VuexModule {
    // state
    public selectedDepth: string = 'surfaceLayer';
    public depthStart: number | null = null;
    public depthEnd: number | null = null;
    public timeSpanStart: Date | null = null;
    public timeSpanEnd: Date | null = new Date();
    public periodStart: Date | null = null;
    public periodEnd: Date | null = null;
    public selectedSites: Site[] = [];

    // mutations

    @Mutation
    public setSelectedDepth(depth: string) {
        this.selectedDepth = depth;
    }

    @Mutation
    public setDepthStart(depthStart: number | null) {
        this.depthStart = depthStart;
    }

    @Mutation
    public setDepthEnd(depthEnd: number | null) {
        this.depthEnd = depthEnd;
    }

    @Mutation
    public setTimeSpanStart(timeSpanStart: Date | null) {
        this.timeSpanStart = timeSpanStart;
    }

    @Mutation
    public setTimeSpanEnd(timeSpanEnd: Date | null) {
        this.timeSpanEnd = timeSpanEnd;
    }

    @Mutation
    public setPeriodStart(periodStart: Date | null) {
        this.periodStart = periodStart;
    }

    @Mutation
    public setPeriodEnd(periodEnd: Date | null) {
        this.periodEnd = periodEnd;
    }

    @Mutation
    public addSelectedSite(selectedSite: Site) {
        this.selectedSites.push(selectedSite);
    }

    @Mutation
    public removeSite(site: Site) {
        const index = this.selectedSites.findIndex((s) => s === site);
        if (index >= 0) {
            this.selectedSites.splice(index, 1);
        }
    }
}

export const searchParameterModule = new SearchParameterModule({
    store,
    name: 'searchParameters',
});
