
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IAttributeModule } from '@/store/attributeModules/IAttributeModule';
@Component
export default class SelectionButton extends Vue {
  @Prop({ required: true, type: String })
  public readonly name!: string;
  @Prop({ required: true })
  public readonly module!: IAttributeModule;
  @Prop({ type: Boolean, default: false })
  public expandable!: boolean;
  @Prop({ type: Boolean, default: false })
  public disabled!: boolean;

  get selected() {
    return this.module.isSelected;
  }

  public onClick() {
    this.module.toggleSelected();
  }
}
