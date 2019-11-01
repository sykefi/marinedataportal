import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterLevels } from '@/queries/FMI/getWaterLevelQuery';

@Module({ generateMutationSetters: true })
class WaterLevelModule extends VuexModule implements IAttributeModule {
  public loading = false;
  public isSelected = false;

  @Mutation
  public toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    await getWaterLevels(params);
    this.loading = false;
  }
}

export const waterLevelModule = new WaterLevelModule({
  store,
  name: 'waterLevel',
});
