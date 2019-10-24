
import { Component, Prop, Vue } from 'vue-property-decorator';
import { attributeModule } from '@/store/attributeModule';

@Component
export default class SelectionButton extends Vue {
  @Prop({ required: true, type: String })
  public readonly name!: string;
  @Prop({ type: Boolean, default: false })
  public expandable!: boolean;

  public selected = attributeModule.isAttributeSelected(this.name);

  public onClick() {
    this.selected = !this.selected;
    this.selected ? attributeModule.addSelectedAttribute(this.name) : attributeModule.removeAttribute(this.name);
    this.$emit('selected');
  }
}
