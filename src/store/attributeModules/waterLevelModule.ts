import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
import { SiteTypes } from '@/queries/site';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterLevels } from '@/queries/FMI/getWaterLevelQuery';
import { PREVIEW_ROW_COUNT } from '@/config';
import { toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';

@Module({ generateMutationSetters: true })
class WaterLevelModule extends VuexModule implements IAttributeModule {
  public hasOptionsSelected = true;
  public name = '$waterLevel';
  public loading = false;
  public isSelected = false;
  public data: IResponseFormat[] | null = null;
  public siteTypes = [SiteTypes.FmiBuoy, SiteTypes.Mareograph];

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
    const results = await getWaterLevels(params);
    const inFmiFormat = results.map((r) => toFmiFormat(r, 'Water level', 'cm'));
    this.data = inFmiFormat;
    this.loading = false;
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    return [];
  }
}

export const waterLevelModule = new WaterLevelModule({
  store,
  name: 'waterLevel',
});
