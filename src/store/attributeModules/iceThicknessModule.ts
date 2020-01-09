import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from './IAttributeModule';
import { SiteTypes } from '@/queries/site';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getObservations, getObservationSiteIds } from '@/queries/Vesla/getObservationsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';

@Module({ generateMutationSetters: true })
class IceThicknessModule extends VuexModule implements IAttributeModule {
  public hasOptionsSelected = true;
  public name = '$iceThickness';
  public loading = false;
  public isSelected = false;
  public data: IResponseFormat[] | null = null;
  public siteTypes = [SiteTypes.Vesla];
  private obsCode = 'THICKI';

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
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

export const iceThicknessModule = new IceThicknessModule({
  store,
  name: 'iceThickness',
});
