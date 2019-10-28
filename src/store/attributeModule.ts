import { Module, Mutation, VuexModule } from 'vuex-class-modules';

@Module
class AttributeModule extends VuexModule {
    // state
    public selectedAttributes: string[] = [];
    public selectedDepth: string = 'surfaceLayer';
    public depthStart: number | null = null;
    public depthEnd: number | null = null;
    public timeSpanStart: Date | null = null;
    public timeSpanEnd: Date = new Date();
    public periodStart: Date | null = null;
    public periodEnd: Date | null = null;

    // mutations

    @Mutation
    public addSelectedAttribute(selectedAttribute: string) {
        this.selectedAttributes.push(selectedAttribute);
    }

    @Mutation
    public removeAttribute(name: string) {
        const index = this.selectedAttributes.findIndex((s) => s === name);
        if (index >= 0) {
            this.selectedAttributes.splice(index, 1);
        }
    }

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
    public setTimeSpanStart(timeSpanStart: Date) {
        this.timeSpanStart = timeSpanStart;
    }

    @Mutation
    public setTimeSpanEnd(timeSpanEnd: Date) {
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

    // getters

    public isAttributeSelected(name: string) {
        return this.selectedAttributes.includes(name);
    }
}

import store from './store';
export const attributeModule = new AttributeModule({
    store,
    name: 'attributes',
});
