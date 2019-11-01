import { Component, Prop, Vue } from 'vue-property-decorator';
import OptionsSelection from '@/components/attributeSelection/OptionsSelection.vue';
import DepthSelection from '@/components/attributeSelection/DepthSelection.vue';
import { waterQualityModule } from '@/store/attributeModules/waterQualityModule';

@Component({
  components: {
    OptionsSelection,
    DepthSelection,
  },
})
export default class WaterQualityDetails extends Vue {
  get module() {
    return waterQualityModule;
  }
}
