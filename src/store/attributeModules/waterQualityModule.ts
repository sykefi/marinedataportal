import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import {
  getWaterQualityOptions,
  IWaterQualityOption,
} from '@/queries/Vesla/getWaterQualityOptionsQuery';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
import store from '@/store/store';
import { CommonParameters } from '@/queries/commonParameters';
import {
  getWaterQuality,
  getWaterQualitySiteIds,
} from '@/queries/Vesla/getWaterQualityQuery';
import { IAttributeOption } from './IAttributeOption';
import { PREVIEW_ROW_COUNT } from '@/config';
import { alphabeticCompare } from '@/helpers';
import { SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import i18n from '@/locale/i18n';

export enum DepthOptions {
  SurfaceLayer,
  SeaFloorLayer,
  DepthInterval,
  AllLayers,
}

export interface IDepthSettings {
  option: DepthOptions;
  start?: number;
  end?: number;
}

@Module({ generateMutationSetters: true })
export class WaterQualityModule
  extends VuexModule
  implements IAttributeModuleWithOptions
{
  public name = '$waterQuality';
  public isSelected = false;
  public loading = false;
  public language: string | null = null;
  public selectedIds: number[] = [];
  public data: IResponseFormat[] | null = null;
  public siteTypes = [SiteTypes.Vesla];
  public selectedDepth: IDepthSettings = { option: DepthOptions.AllLayers };
  public options: IWaterQualityOption[] = [];
  public availableOptions: IAttributeOption[] = [];

  get previewData() {
    return this.data ? this.data.slice(0, PREVIEW_ROW_COUNT) : [];
  }

  get hasOptionsSelected() {
    return !!this.selectedIds.length;
  }

  get rowCount() {
    return this.data ? this.data.length : 0;
  }

  get errors() {
    const errors: string[] = [];
    if (this.selectedDepth.option === DepthOptions.DepthInterval) {
      const start = this.selectedDepth.start;
      const end = this.selectedDepth.end;
      if (start === undefined) {
        errors.push('$missingDepthStart');
      }
      if (end === undefined) {
        errors.push('$missingDepthEnd');
      } else if (start && start > end) {
        errors.push('$depthStartGreaterThanDepthEnd');
      }
    }
    return errors;
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
    this.options.forEach((option) => {
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
    if (this.options.length === 0) {
      this.loading = true;
      const options = await getWaterQualityOptions();

      const lang = i18n.global.locale;
      const availableOptions = options.map((o) => ({
        id: o.id,
        name: lang === 'fi' ? o.name_fi : lang === 'sv' ? o.name_sv : o.name_en,
        online: true,
      }));

      this.availableOptions = availableOptions.sort((a, b) =>
        alphabeticCompare(a.name, b.name)
      );

      this.loading = false;
    }
  }

  @Action
  public async getAvailableVeslaSiteIds(params: CommonParameters) {
    this.loading = true;
    const res = await getWaterQualitySiteIds(
      params,
      this.selectedIds,
      this.selectedDepth
    );
    this.loading = false;
    return res;
  }

  @Action
  public async getData(params: CommonParameters) {
    this.loading = true;
    this.data = await getWaterQuality(
      params,
      this.selectedIds,
      this.selectedDepth
    );
    this.loading = false;
  }
}

export const waterQualityModule = new WaterQualityModule({
  store,
  name: 'waterQuality',
});
