import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import i18n from '@/locale/i18n';
import { IAttributeModuleWithOptions } from './IAttributeModuleWithOptions';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { ModuleTypes } from './IAttributeModule';

@Module({ generateMutationSetters: true })
class SurgeModule extends VuexModule implements IAttributeModuleWithOptions {
  public name = '$surge';
  public loading = false;
  public isSelected = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];
  public data: object[] | null = null;
  public type = ModuleTypes.Fmi;

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
  }

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  get hasOptionsSelected() {
    return !!this.selectedIds.length;
  }

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
  public getOptions() {
    if (this.availableOptions.length === 0) {
      const keys = ['$waveDirection', '$waterTemperature', '$waveHeight', '$waveletDivergence', '$modalPeriod'];
      keys.forEach((key, id) => {
        this.availableOptions.push({ id, name: i18n.t(key).toString() });
      });
    }
  }

  @Action
  public async getData(params: CommonParameters) {
    throw new Error('Method not implemented.');
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    throw new Error('Method not implemented.');
    return [];
  }
}

export const surgeModule = new SurgeModule({
  store,
  name: 'surge',
});
