import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import { getWaterQualityOptions, IWaterQualityOption } from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import store from '../store';
import { CommonParameters } from '@/queries/commonParameters';
import { getWaterQuality } from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './IAttributeOption';

@Module({ generateMutationSetters: true })
class WaterQualityModule extends VuexModule implements IAttributeModuleWithOptions {
  public isSelected = false;
  public loading = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];

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
      const options = await getWaterQualityOptions();
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
    const res = await getWaterQuality(params, this.selectedIds);
    this.loading = false;
  }
}

export const waterQualityModule = new WaterQualityModule({
  store,
  name: 'waterQuality',
});
