import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule, ModuleTypes } from './IAttributeModule';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getObservations, getObservationSiteIds } from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';

@Module({ generateMutationSetters: true })
class SecchiDepthModule extends VuexModule implements IAttributeModule {
  public hasOptionsSelected = true;
  public name = '$secchiDepth';
  public loading = false;
  public isSelected = false;
  public data: object[] | null = null;
  public type = ModuleTypes.Vesla;
  private obsCode = 'SDT';

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
  }

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  @Mutation
  public toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    this.data = await getObservations(params, this.obsCode);
    this.loading = false;
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    this.loading = true;
    const res = await getObservationSiteIds(params, this.obsCode);
    this.loading = false;
    return res;
  }
}

export const secchiDepthModule = new SecchiDepthModule({
  store,
  name: 'secchiDepth',
});
