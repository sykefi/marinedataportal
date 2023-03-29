import SelectionHeader from "@/components/common/SelectionHeader.vue";
import SelectionButton from "@/components/common/selectionButton/SelectionButton.vue";
import SurgeDetails from "@/components/attributeSelection/SurgeDetails.vue";
import TemperatureDetails from "@/components/attributeSelection/TemperatureDetails.vue";
import WaterQualityDetails from "@/components/attributeSelection/WaterQualityDetails.vue";
import { waterQualityModule } from "@/store/attributeModules/waterQualityModule";
import { surfaceTemperatureModule } from "@/store/attributeModules/surfaceTemperatureModule";
import { surgeModule } from "@/store/attributeModules/surgeModule";
import { iceThicknessModule } from "@/store/attributeModules/iceThicknessModule";
import { benthicFaunaModule } from "@/store/attributeModules/benthicFaunaModule";
import { phytoPlanktonModule } from "@/store/attributeModules/phytoPlanktonModule";
import { secchiDepthModule } from "@/store/attributeModules/secchiDepthModule";
import { waterLevelModule } from "@/store/attributeModules/waterLevelModule";
import { mainState } from "@/store/mainState";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    SelectionHeader,
    SelectionButton,
    SurgeDetails,
    TemperatureDetails,
    WaterQualityDetails,
  },
  data() {
    return {
      attributeErrorMessage: "$noAttributesSelected",
    };
  },
  computed: {
    sykeApiOnline() {
      return mainState.sykeApiOnline;
    },
    fmiApiOnline() {
      return mainState.fmiApiOnline;
    },
    surgeModule() {
      return surgeModule;
    },
    surfaceTemperatureModule() {
      return surfaceTemperatureModule;
    },
    waterQualityModule() {
      return waterQualityModule;
    },
    iceThicknessModule() {
      return iceThicknessModule;
    },
    benthicFaunaModule() {
      return benthicFaunaModule;
    },
    phytoplanktonModule() {
      return phytoPlanktonModule;
    },
    secchiDepthModule() {
      return secchiDepthModule;
    },
    waterLevelModule() {
      return waterLevelModule;
    },
    showAttributeError() {
      return mainState.isError(this.attributeErrorMessage);
    },
  },
});
