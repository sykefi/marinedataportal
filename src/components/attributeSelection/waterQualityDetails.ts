import { Component, Prop, Vue } from 'vue-property-decorator';
import DetailsSelection from '@/components/attributeSelection/DetailsSelection.vue';
import DepthSelection from '@/components/attributeSelection/DepthSelection.vue';
import { attributeModule } from '@/store/attributeModule';
import { waterQualityModule } from '@/store/waterQualityModule';

@Component({
  components: {
    DetailsSelection,
    DepthSelection,
  },
})
export default class WaterQualityDetails extends Vue {
  @Prop({ required: true, type: Boolean })
  public readonly downloadClicked!: boolean;

  get attributes(): string[] {
    const translated: string[] = [];
    waterQualityModule.waterQualityOptions.forEach((option) => {
      translated.push(option.name_fi);
    });
    return translated;
  }

  public created() {
    waterQualityModule.getWaterQualityOptions();
  }

  public beforeDestroy() {
    this.attributes.forEach((a) => attributeModule.removeAttribute(a));
  }
}
