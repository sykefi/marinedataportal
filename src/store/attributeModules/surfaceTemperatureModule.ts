import { Module, VuexModule, Mutation, Action } from 'vuex-class-modules';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModuleWithOptions } from './IAttributeModuleWithOptions';
import i18n from '@/locale/i18n';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { getWaterQuality, getWaterQualitySiteIds } from '@/queries/Vesla/getWaterQualityQuery';
import { SiteTypes } from '@/queries/site';
import { getMareographTemperatures } from '@/queries/FMI/getMareographTemperatureQuery';
import { getWaveData, WaveQueryParameters } from '@/queries/FMI/getWaveDataQuery';
import { IFmiResult } from '@/apis/fmiApi';

@Module({ generateMutationSetters: true })
class SurfaceTemperatureModule extends VuexModule implements IAttributeModuleWithOptions {
  public name = '$surfaceTemperature';
  public loading = false;
  public isSelected = false;
  public availableOptions: IAttributeOption[] = [];
  public selectedIds: number[] = [];
  public data: object[] | null = null;
  public siteTypes: SiteTypes[] = [];
  private tempIdInVesla = 25; // DeterminationCombinationId for temperature in Vesla

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
  }

  get hasOptionsSelected() {
    return !!this.selectedIds.length;
  }

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  @Mutation
  public toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  @Mutation
  public setSelectedOptions(ids: number[]) {
    this.selectedIds = ids;
    this.siteTypes = ids;
  }

  @Mutation
  public selectAll() {
    this.availableOptions.forEach((option) => {
      if (!this.selectedIds.includes(option.id)) {
        this.selectedIds.push(option.id);
        this.siteTypes.push(option.id);
      }
    });
  }

  @Mutation
  public deSelectAll() {
    this.selectedIds = [];
    this.siteTypes = [];
  }

  @Mutation
  public getOptions() {
    if (this.availableOptions.length === 0) {
      this.availableOptions.push({ id: SiteTypes.FmiBuoy, name: i18n.t('$waveBuoys').toString() });
      this.availableOptions.push({ id: SiteTypes.Mareograph, name: i18n.t('$mareographs').toString() });
      this.availableOptions.push({ id: SiteTypes.Vesla, name: i18n.t('$marineStations').toString() });
    }
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    const tempData: any[] = [];
    let hasVeslaData = false;
    if (params.veslaSites.length) {
      tempData.push(...await getWaterQuality(params, [this.tempIdInVesla], true));
      hasVeslaData = !!tempData.length;
    }
    if (params.mareographSites.length) {
      let response: any[] = await getMareographTemperatures(params);

      if (hasVeslaData) {
        response = response.map((r) => toCommonFormat(r));
      }
      tempData.push(...response);
    }
    if (params.buoySites.length) {
      let response: any[] = await getWaveData(params, [WaveQueryParameters.waterTemperature], false);

      if (hasVeslaData) {
        response = response.map((r) => toCommonFormat(r));
      }
      tempData.push(...response);
    }
    this.data = tempData;
    this.loading = false;


    function toCommonFormat(obj: IFmiResult) {
      return {
        time: obj.time,
        analyteName: obj.parameterName,
        value: 'Temperature',
        unit: '°C',
        siteId: obj.siteId,
        site: obj.siteName,
        siteLatitudeWGS84: obj.lat,
        siteLongitudeWGS84: obj.long,
        samplingLatitudeWGS84: null,
        samplingLongitudeWGS84: null,
        sampleDepthM: null,
        sampleDepthUpperM: null,
        sampleDepthLowerM: null,
        siteDepthM: null,
        totalDepthM: null,
        dataSource: obj.dataSource,
      };
    }
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    this.loading = true;
    const res = await getWaterQualitySiteIds(params, [this.tempIdInVesla], true);
    this.loading = false;
    return res;
  }
}

export const surfaceTemperatureModule = new SurfaceTemperatureModule({
  store,
  name: 'surfaceTemperature',
});
