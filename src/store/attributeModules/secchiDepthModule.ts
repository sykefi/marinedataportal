import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from './IAttributeModule';
import store from '../store';
import { CommonParameters } from '@/queries/commonParameters';

@Module({ generateMutationSetters: true })
class SecchiDepthModule extends VuexModule implements IAttributeModule {
  public loading = false;
  public isSelected = false;

  @Mutation
  public toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  @Action
  public async getData(params: CommonParameters) {
    throw new Error('Method not implemented.');
  }
}

export const secchiDepthModule = new SecchiDepthModule({
  store,
  name: 'secchiDepth',
});
