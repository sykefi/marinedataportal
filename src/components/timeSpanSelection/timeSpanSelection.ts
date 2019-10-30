
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import EmptySelectionButton from '@/components/common/emptySelectionButton/EmptySelectionButton';
import { attributeModule } from '@/store/attributeModule';
@Component({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
})
export default class TimeSpanSelection extends Vue {
  @Prop({ required: true, type: Boolean })
  public readonly downloadClicked!: boolean;

  public timeSpanStart: Date | null = attributeModule.timeSpanStart;
  public timeSpanEnd: Date | null = attributeModule.timeSpanEnd;
  public periodStart: Date | null = attributeModule.periodStart;
  public periodEnd: Date | null = attributeModule.periodEnd;
  public periodEmptied: boolean = false;
  public timeSpanStartError = attributeModule.isError('$missingTimeSpanStart') || attributeModule.isError('$timeSpanStartAfterTimeSpanEnd');
  public timeSpanEndError = attributeModule.isError('$missingTimeSpanEnd') || attributeModule.isError('$timeSpanStartAfterTimeSpanEnd');
  public periodStartError = attributeModule.isError('$missingPeriodStart') || attributeModule.isError('$periodStartAfterPeriodEnd');
  public periodEndError = attributeModule.isError('$missingPeriodEnd') || attributeModule.isError('$periodStartAfterPeriodEnd');

  @Watch('downloadClicked')
  public onDownloadClicked(val: boolean, oldVal: boolean) {
    if (val !== oldVal) {
      this.timeSpanStartError = attributeModule.isError('$missingTimeSpanStart') || attributeModule.isError('$timeSpanStartAfterTimeSpanEnd');
      this.timeSpanEndError = attributeModule.isError('$missingTimeSpanEnd') || attributeModule.isError('$timeSpanStartAfterTimeSpanEnd');
      this.periodStartError = attributeModule.isError('$missingPeriodStart') || attributeModule.isError('$periodStartAfterPeriodEnd');
      this.periodEndError = attributeModule.isError('$missingPeriodEnd') || attributeModule.isError('$periodStartAfterPeriodEnd');
    }
  }

  public storeTimeSpanStart(y: number, m: number, d: number) {
    attributeModule.setTimeSpanStart(new Date(y + '-' + m + '-' + d));
  }

  public storeTimeSpanEnd(y: number, m: number, d: number) {
    attributeModule.setTimeSpanEnd(new Date(y + '-' + m + '-' + d));
  }

  public storePeriodStart(y: number, m: number, d: number) {
    // Year is not picked in period selection, it can be any
    attributeModule.setPeriodStart(new Date('2000' + '-' + m + '-' + d));
  }

  public storePeriodEnd(y: number, m: number, d: number) {
    attributeModule.setPeriodEnd(new Date('2000' + '-' + m + '-' + d));
  }

  public resetTimeSpanStart() {
    attributeModule.setTimeSpanStart(null);
  }

  public resetTimeSpanEnd() {
    attributeModule.setTimeSpanEnd(null);
  }

  public resetPeriodStart() {
    attributeModule.setPeriodStart(null);
  }

  public resetPeriodEnd() {
    attributeModule.setPeriodEnd(null);
  }

  public emptyPeriodSelection() {
    this.resetPeriodStart();
    this.resetPeriodEnd();
    this.periodEmptied = !this.periodEmptied;
  }
}
