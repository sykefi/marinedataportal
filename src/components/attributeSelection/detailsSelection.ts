import { Component, Prop, Vue } from 'vue-property-decorator';
import { attributeModule } from '@/store/attributeModule';
@Component
export default class DetailsSelection extends Vue {
  @Prop({ required: true, type: String })
  public header!: string;
  @Prop({ required: true })
  public attributes!: string[];

  public attribute: string = '';
  public selected: string[] = this.attributes.filter((a) => attributeModule.isAttributeSelected(a));

  public updateStore(event: any) {
    const attribute = event.target.value as string;
    this.selected.includes(attribute) ?
      attributeModule.removeAttribute(attribute) : attributeModule.addSelectedAttribute(attribute);
  }

  get selectAll() {
    return this.attributes ? this.selected.length === this.attributes.length : false;
  }

  set selectAll(value: boolean) {
    const selected: string[] = [];
    if (value) {
      this.attributes.forEach((a) => selected.push(a) && attributeModule.addSelectedAttribute(a));
    } else {
      this.attributes.forEach((a) => attributeModule.removeAttribute(a));
    }

    this.selected = selected;
  }
}
