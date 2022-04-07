import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from './IAttributeModule';
import { SiteTypes } from '@/queries/site';
import store from '@/store/store';
import { PREVIEW_ROW_COUNT } from '@/config';
import { IResponseFormat } from '@/queries/IResponseFormat';

@Module({ generateMutationSetters: true })
class PhytoPlanktonModule extends VuexModule implements IAttributeModule {
  public hasOptionsSelected = true;
  public name = '$phytoPlankton';
  public loading = false;
  public isSelected = false;
  public data: IResponseFormat[] | null = null;
  public siteTypes = [SiteTypes.Vesla];

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
  public async getData() {
    throw new Error('Method not implemented.');
  }

  @Action
  public async getAvailableVeslaSiteIds() {
    throw new Error('Method not implemented.');
    return [];
  }
}

export const phytoPlanktonModule = new PhytoPlanktonModule({
  store,
  name: 'phytoPlankton',
});
