import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
@Component
export default class OptionsSelection extends Vue {
  @Prop({ required: true, type: String })
  public header!: string;
  @Prop({ required: true })
  public module!: IAttributeModuleWithOptions;
  @Prop({ required: false, type: Boolean })
  public twoColumns!: boolean;
  public showPhosphorusMessage: boolean = false;

  get isWaterQualityModule() {
    return this.module.name === '$waterQuality';
  }

  get selectedIds() {
    return this.module.selectedIds;
  }
  set selectedIds(e) {
    this.showPhosphorusMessage = this.includesPhosphorus(e);
    this.module.setSelectedOptions(e);
  }

  get availableOptions() {
    return this.module.availableOptions;
  }

  get selectAll() {
    return this.selectedIds ? this.selectedIds.length === this.module.availableOptions.length : false;
  }

  set selectAll(value: boolean) {
    if (value) {
      this.module.selectAll();
      if (this.includesPhosphorus(this.selectedIds)) {
        this.showPhosphorusMessage = true;
      }
    } else {
      this.module.deSelectAll();
      this.showPhosphorusMessage = false;
    }
  }

  get cssVars() {
    return {
      '--length': Math.ceil(this.module.availableOptions.length / 2),
    };
  }

  public includesPhosphorus(ids: number[]) {
    if (this.module.name === '$waterQuality') {
      return ids.some((id) => [20, 33, 44, 55].includes(id));
    }
    return false;
  }
}
