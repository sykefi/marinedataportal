import { createStore } from 'vuex';
import { BenthicFaunaModule } from './attributeModules/benthicFaunaModule';
import { IceThicknessModule } from './attributeModules/iceThicknessModule';
import { PhytoPlanktonModule } from './attributeModules/phytoPlanktonModule';
import { SecchiDepthModule } from './attributeModules/secchiDepthModule';
import { SurgeModule } from './attributeModules/surgeModule';
import { WaterLevelModule } from './attributeModules/waterLevelModule';
import { WaterQualityModule } from './attributeModules/waterQualityModule';

export default createStore({
  strict: !import.meta.env.PROD,
  modules: {
    benthicFauna: BenthicFaunaModule,
    iceThickness: IceThicknessModule,
    phytoPlankton: PhytoPlanktonModule,
    secchiDepth: SecchiDepthModule,
    surge: SurgeModule,
    waterLevel: WaterLevelModule,
    waterQuality: WaterQualityModule,
  },
});
