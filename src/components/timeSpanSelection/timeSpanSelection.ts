
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import EmptySelectionButton from '@/components/common/emptySelectionButton/EmptySelectionButton';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
@Component({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
})
export default class TimeSpanSelection extends Vue {
  public timeSpanStart: Date | null = searchParameterModule.timeSpanStart;
  public timeSpanEnd: Date | null = searchParameterModule.timeSpanEnd;
  public periodStart: Date | null = searchParameterModule.periodStart;
  public periodEnd: Date | null = searchParameterModule.periodEnd;
  public periodEmptied: boolean = false;
  get timeSpanStartError() {
    return mainState.isError('$missingTimeSpanStart')
      || mainState.isError('$timeSpanStartAfterTimeSpanEnd');
  }

  get timeSpanEndError() {
    return mainState.isError('$missingTimeSpanEnd')
      || mainState.isError('$timeSpanStartAfterTimeSpanEnd');
  }

  get periodEndError() {
    return mainState.isError('$missingPeriodEnd')
      || mainState.isError('$periodStartAfterPeriodEnd');
  }

  get periodStartError() {
    return mainState.isError('$missingPeriodStart')
      || mainState.isError('$periodStartAfterPeriodEnd');
  }

  public storeTimeSpanStart(y: number, m: number, d: number) {
    searchParameterModule.timeSpanStart = new Date(y + '-' + m + '-' + d);
  }

  public storeTimeSpanEnd(y: number, m: number, d: number) {
    searchParameterModule.timeSpanEnd = new Date(y + '-' + m + '-' + d);
  }

  public storePeriodStart(y: number, m: number, d: number) {
    // Year is not picked in period selection, it can be any
    searchParameterModule.periodStart = new Date('2000' + '-' + m + '-' + d);
  }

  public storePeriodEnd(y: number, m: number, d: number) {
    searchParameterModule.periodEnd = new Date('2000' + '-' + m + '-' + d);
  }

  public resetTimeSpanStart() {
    searchParameterModule.timeSpanStart = null;
  }

  public resetTimeSpanEnd() {
    searchParameterModule.timeSpanEnd = null;
  }

  public resetPeriodStart() {
    searchParameterModule.periodStart = null;
  }

  public resetPeriodEnd() {
    searchParameterModule.periodEnd = null;
  }

  public emptyPeriodSelection() {
    this.resetPeriodStart();
    this.resetPeriodEnd();
    this.periodEmptied = !this.periodEmptied;
  }
}
