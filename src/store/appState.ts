import { Module, Mutation, VuexModule, Action } from 'vuex-class-modules';
import store from './store';
import { waterQualityModule } from './attributeModules/waterQualityModule';
import { CommonParameters } from '@/queries/commonParameters';
import { IAttributeModule } from './attributeModules/IAttributeModule';
import { benthicFaunaModule } from './attributeModules/benthicFaunaModule';
import { iceThicknessModule } from './attributeModules/iceThicknessModule';
import { phytoPlanktonModule } from './attributeModules/phytoPlanktonModule';
import { secchiDepthModule } from './attributeModules/secchiDepthModule';
import { surfaceTemperatureModule } from './attributeModules/sufaceTemperatureModule';
import { surgeModule } from './attributeModules/surgeModule';
import { waterLevelModule } from './attributeModules/waterLevelModule';
import { IAttributeModuleWithOptions } from './attributeModules/IAttributeModuleWithOptions';
@Module
class MainState extends VuexModule {
  public errorList: string[] = [];

  private modules: IAttributeModule[] = [
    benthicFaunaModule,
    iceThicknessModule,
    phytoPlanktonModule,
    secchiDepthModule,
    surfaceTemperatureModule,
    surgeModule,
    waterLevelModule,
    waterQualityModule,
  ];

  @Mutation
  public setErrorList(errorList: string[]) {
    this.errorList = errorList;
  }

  // getters

  public isError(name: string) {
    return this.errorList.includes(name);
  }

  get loading() {
    return !!this.modules.find((m) => m.loading);
  }

  get selectedAttributeModules() {
    return this.modules.filter((m) => m.isSelected);
  }

  @Action
  public async populateSelectionOptions() {
    this.modules.forEach((module) => {
      if (this.moduleHasOptions(module)) {
        module.getOptions();
      }
    });
  }

  @Action
  public async downloadData(params: CommonParameters) {
    this.modules.forEach((module) => {
      if (module.isSelected) {
        module.getData(params);
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
