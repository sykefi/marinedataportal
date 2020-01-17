import { Module, VuexModule, Action, Mutation } from 'vuex-class-modules';
import store from './store';
import { waterQualityModule } from './attributeModules/waterQualityModule';
import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModule } from './attributeModules/IAttributeModule';
import { SiteTypes } from '@/queries/site';
import { benthicFaunaModule } from './attributeModules/benthicFaunaModule';
import { iceThicknessModule } from './attributeModules/iceThicknessModule';
import { phytoPlanktonModule } from './attributeModules/phytoPlanktonModule';
import { secchiDepthModule } from './attributeModules/secchiDepthModule';
import { surfaceTemperatureModule } from './attributeModules/surfaceTemperatureModule';
import { surgeModule } from './attributeModules/surgeModule';
import { waterLevelModule } from './attributeModules/waterLevelModule';
import { IAttributeModuleWithOptions } from './attributeModules/IAttributeModuleWithOptions';
import { searchParameterModule } from './searchParameterModule';

@Module
class MainState extends VuexModule {

  get loading() {
    return searchParameterModule.loading || this.attributeModules.find((m) => m.loading);
  }

  get selectedAttributeModules() {
    return this.attributeModules.filter((m) =>
      m.isSelected && m.hasOptionsSelected);
  }

  get selectedSiteTypes() {
    const allSiteTypes: SiteTypes[] = [];
    this.selectedAttributeModules.forEach((a) => { allSiteTypes.push(...a.siteTypes); });
    return [...new Set(allSiteTypes)];
  }

  public errorList: string[] = [];

  public sykeApiOnline: boolean = true;
  public fmiApiOnline: boolean = true;

  get attributeModules() {
    return [
      benthicFaunaModule,
      iceThicknessModule,
      phytoPlanktonModule,
      secchiDepthModule,
      surfaceTemperatureModule,
      surgeModule,
      waterLevelModule,
      waterQualityModule,
    ];
  }

  @Mutation
  public setErrorList(errors: string[]) {
    this.errorList = errors;
  }

  @Mutation
  public setSykeApiOnlineStatus(isOnline: boolean) {
    this.sykeApiOnline = isOnline;
  }

  @Mutation
  public setFmiApiOnlineStatus(isOnline: boolean) {
    this.fmiApiOnline = isOnline;
  }

  public isError(name: string) {
    return this.errorList.includes(name);
  }

  @Action
  public async populateSelectionOptions() {
    this.attributeModules.forEach((module) => {
      if (this.moduleHasOptions(module)) {
        module.getOptions();
      }
    });
  }

  @Action
  public async populateAvailableSites(params: CommonParameters) {
    const veslaIds: number[] = [];
    for (const module of this.selectedAttributeModules) {
      const ids = await module.getAvailableVeslaSiteIds(params);
      veslaIds.push(...ids);
    }
    // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    searchParameterModule.populateAvailableSites([...new Set(veslaIds)]);
  }

  @Action
  public async downloadData() {
    this.attributeModules.forEach((module) => {
      module.data = null;
      if (module.isSelected && module.hasOptionsSelected) {
        module.getData(searchParameterModule.parameters);
      }
    });
  }

  private moduleHasOptions(arg: IAttributeModule): arg is IAttributeModuleWithOptions {
    return (arg as IAttributeModuleWithOptions).availableOptions !== undefined;
  }
}

export const mainState = new MainState({
  store,
  name: 'mainState',
});
