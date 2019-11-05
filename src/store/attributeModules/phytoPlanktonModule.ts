import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from './IAttributeModule';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { PREVIEW_ROW_COUNT } from '@/config';

@Module({ generateMutationSetters: true })
class PhytoPlanktonModule extends VuexModule implements IAttributeModule {
  public name = '$phytoPlankton';
  public loading = false;
  public isSelected = false;
  public data: object[] | null = null;

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
    throw new Error('Method not implemented.');
  }
}

export const phytoPlanktonModule = new PhytoPlanktonModule({
  store,
  name: 'phytoPlankton',
});
