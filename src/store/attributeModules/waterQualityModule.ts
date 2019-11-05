import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import { getWaterQualityOptions } from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterQuality } from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './IAttributeOption';
import { IWaterQualityOption } from '@/queries/getWaterQualityOptionsQuery';
import { PREVIEW_ROW_COUNT } from '@/config';

@Module({ generateMutationSetters: true })
class WaterQualityModule extends VuexModule implements IAttributeModuleWithOptions {
  public name = '$waterQuality';
  public isSelected = false;
  public loading = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];
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

  @Mutation
  public toggleSelectedOption(id: number) {
    const index = this.selectedIds.findIndex((i) => i === id);
    if (index >= 0) {
      this.selectedIds.splice(index, 1);
    } else {
      this.selectedIds.push(id);
    }
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

  @Action
  public async getOptions() {
    if (this.availableOptions.length === 0) {
      this.loading = true;
      const options = await getWaterQualityOptions() as IWaterQualityOption[];
      const available: IAttributeOption[] = [];
      options.forEach((option) => {
        // TODO: language based on selection
        available.push({ id: option.id, name: option.name_fi });
      });
      this.availableOptions = available;
      this.loading = false;
    }
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
