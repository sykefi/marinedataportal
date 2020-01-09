import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import i18n from '@/locale/i18n';
import { IAttributeModuleWithOptions } from './IAttributeModuleWithOptions';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { SiteTypes } from '@/queries/site';
import { getWaveData, WaveQueryParameters } from '@/queries/FMI/getWaveDataQuery';
import { toFmiFormat } from '@/helpers';
import { IResponseFormat } from '@/queries/IResponseFormat';

@Module({ generateMutationSetters: true })
class SurgeModule extends VuexModule implements IAttributeModuleWithOptions {
  public name = '$surge';
  public loading = false;
  public isSelected = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];
  public data: IResponseFormat[] | null = null;
  public siteTypes = [SiteTypes.FmiBuoy, SiteTypes.Mareograph];

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
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
    this.availableOptions = [];
    const keys = ['$waveDirection', '$waveHeight', '$waveletDivergence', '$modalPeriod', '$waterTemperature'];
    keys.forEach((key, id) => {
      this.availableOptions.push({ id, name: i18n.t(key).toString() });
    });
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    const queryParams: WaveQueryParameters[] = [];
    if (this.selectedIds.includes(0)) {
      queryParams.push(WaveQueryParameters.direction);
    }
    if (this.selectedIds.includes(1)) {// temp
      queryParams.push(WaveQueryParameters.waterTemperature);
    }
    if (this.selectedIds.includes(2)) {// height
      queryParams.push(WaveQueryParameters.waveHeight);
    }
    if (this.selectedIds.includes(3)) {// modal period
      queryParams.push(WaveQueryParameters.modalPeriod);
    }
    if (this.selectedIds.includes(4)) { // deviation
      queryParams.push(WaveQueryParameters.directionDeviation);
    }

    const results = await getWaveData(params, queryParams);
    const inFmiFormat = results.map((r) => {
      let parameterName = '';
      let unit = '';
      switch (r.parameterName) {
        case WaveQueryParameters.direction:
          parameterName = 'Wave direction';
          unit = '°';
          break;
        case WaveQueryParameters.directionDeviation:
          parameterName = 'Direction deviation';
          unit = '°';
          break;
        case WaveQueryParameters.modalPeriod:
          parameterName = 'Modal period';
          unit = 's';
          break;
        case WaveQueryParameters.waterTemperature:
          parameterName = 'Water temperature';
          unit = '°C';
          break;
        case WaveQueryParameters.waveHeight:
          parameterName = 'Wave height';
          unit = 'm';
          break;
        default:
          break;
      }
      return toFmiFormat(r, parameterName, unit);
    });
    this.data = inFmiFormat;
    this.loading = false;
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    return [];
  }
}

export const surgeModule = new SurgeModule({
  store,
  name: 'surge',
});
