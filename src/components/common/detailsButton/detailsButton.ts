import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class DetailsButton extends Vue {
    @Prop({ required: true, type: String })
    public readonly contentKey!: string;

    public shown = false;
    public rightOverFlow = false;
}
