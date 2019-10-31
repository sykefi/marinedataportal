import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import { getWaterQualityOptions, IWaterQualityOption } from '@/queries/getWaterQualityOptionsQuery';

@Module
class WaterQualityModule extends VuexModule {
  public waterQualityOptions: IWaterQualityOption[] = [];

  @Action
  public async getWaterQualityOptions() {
    if (this.waterQualityOptions.length === 0) {
      this.setWaterQualityOptions(await getWaterQualityOptions());
    }
  }

  @Mutation
  private setWaterQualityOptions(options: IWaterQualityOption[]) {
    this.waterQualityOptions = options;
  }
}

import store from './store';
export const waterQualityModule = new WaterQualityModule({
  store,
  name: 'waterQuality',
});
