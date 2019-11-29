import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import { getWaterQualityOptions, IWaterQualityOption } from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterQuality, getWaterQualitySiteIds } from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { alphabeticCompare } from '@/helpers';
import { ModuleTypes } from './IAttributeModule';

@Module({ generateMutationSetters: true })
class WaterQualityModule extends VuexModule implements IAttributeModuleWithOptions {

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
  }

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  get hasOptionsSelected() {
    return !!this.selectedIds.length;
  }
  public name = '$waterQuality';
  public isSelected = false;
  public loading = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];
  public data: object[] | null = null;
  public type = ModuleTypes.Vesla;
  private options: IWaterQualityOption[] = [];

  @Mutation
  public toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  @Mutation
  public setSelectedOptions(ids: number[]) {
    this.selectedIds = ids;
  }

  @Mutation
  public selectAll() {
    this.availableOptions.forEach((option) => {
      if (!this.selectedIds.includes(option.id)) {
        this.selectedIds.push(option.id);
      }
    });
  }

  @Mutation
  public deSelectAll() {
    this.selectedIds = [];
  }

  @Mutation
  public setLanguage(lang: string) {
    if (lang === 'en') {
      this.availableOptions = this.options.map((o) => ({ id: o.id, name: o.name_en }));
    } else {
      this.availableOptions = this.options.map((o) => ({ id: o.id, name: o.name_fi }));
    }
    this.availableOptions.sort((a, b) => alphabeticCompare(a.name, b.name));
  }

  @Action
  public async getOptions() {
    if (this.availableOptions.length === 0) {
      this.loading = true;
      this.options = await getWaterQualityOptions();
      this.setLanguage('fi');
      this.loading = false;
    }
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    this.loading = true;
    const res = await getWaterQualitySiteIds(params, this.selectedIds);
    this.loading = false;
    return res;
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    this.data = await getWaterQuality(params, this.selectedIds);
    this.loading = false;
  }
}

export const waterQualityModule = new WaterQualityModule({
  store,
  name: 'waterQuality',
});
