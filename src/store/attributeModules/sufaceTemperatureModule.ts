import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import store from '../store';
import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModuleWithOptions } from './IAttributeModuleWithOptions';
import i18n from '@/locale/i18n';
import { IAttributeOption } from './IAttributeOption';

@Module({ generateMutationSetters: true })
class SurfaceTemperatureModule extends VuexModule implements IAttributeModuleWithOptions {
  public loading = false;
  public isSelected = false;
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

  @Mutation
  public getOptions() {
    if (this.availableOptions.length === 0) {
      const keys = ['$waveBuoys', '$mareograps', '$marineStations'];
      keys.forEach((key, id) => {
        this.availableOptions.push({ id, name: i18n.t(key).toString() });
      });
    }
  }

  @Action
  public async getData(params: CommonParameters) {
    throw new Error('Method not implemented.');
  }
}

export const surfaceTemperatureModule = new SurfaceTemperatureModule({
  store,
  name: 'surfaceTemperature',
});
