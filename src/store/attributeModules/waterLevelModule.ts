import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterLevels } from '@/queries/FMI/getWaterLevelQuery';
import { PREVIEW_ROW_COUNT } from '@/config';

@Module({ generateMutationSetters: true })
class WaterLevelModule extends VuexModule implements IAttributeModule {
  public name = '$waterLevel';
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
    this.loading = true;
    this.data = await getWaterLevels(params);
    this.loading = false;
  }

  @Action
  public async getAvailableSiteIds(params: CommonParameters) {
    throw new Error('Method not implemented.');
    return [];
  }
}

export const waterLevelModule = new WaterLevelModule({
  store,
  name: 'waterLevel',
});
