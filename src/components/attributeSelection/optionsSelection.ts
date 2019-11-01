import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAttributeModuleWithOptions } from '@/store/attributeModules/IAttributeModuleWithOptions';
@Component
export default class OptionsSelection extends Vue {
  @Prop({ required: true, type: String })
  public header!: string;
  @Prop({ required: true })
  public module!: IAttributeModuleWithOptions;

  get selectedIds() {
    return this.module.selectedIds;
  }
  set selectedIds(e) {
    this.module.selectedIds = e;
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
    } else {
      this.module.deSelectAll();
    }
  }
}