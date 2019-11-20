
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import EmptySelectionButton from '@/components/common/emptySelectionButton/EmptySelectionButton.vue';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
import { ITimeSpanSelection } from '@/store/ITimeSpanSelection';
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
  public periodStart: ITimeSpanSelection | null = searchParameterModule.periodStart;
  public periodEnd: ITimeSpanSelection | null = searchParameterModule.periodEnd;
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

  public storeTimeSpanStart(date: Date | null) {
    searchParameterModule.timeSpanStart = date;
  }

  public storeTimeSpanEnd(date: Date | null) {
    searchParameterModule.timeSpanEnd = date;
  }

  public storePeriodStart(date: Date | null) {
    searchParameterModule.periodStart = date ? { month: date.getMonth() + 1, day: date.getDate() } : null;
  }

  public storePeriodEnd(date: Date | null) {
    searchParameterModule.periodEnd = date ? { month: date.getMonth() + 1, day: date.getDate() } : null;
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
