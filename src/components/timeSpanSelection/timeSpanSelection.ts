
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
      || mainState.isError('$incompletePeriodEnd');
  }

  get periodStartError() {
    return mainState.isError('$missingPeriodStart')
      || mainState.isError('$incompletePeriodStart');
  }

  public storeTimeSpanStart(date: Date | null) {
    searchParameterModule.timeSpanStart = date;
  }

  public storeTimeSpanEnd(date: Date | null) {
    searchParameterModule.timeSpanEnd = date;
  }

  public storePeriodStart(date: Date | null ) {
    const isValid = date?.getTime() !== new Date('0000-01-01T00:00:00').getTime();
    searchParameterModule.periodStart = date ? { month: date.getMonth() + 1, day: date.getDate(), isValid } : null;
  }

  public storePeriodEnd(date: Date | null) {
    const isValid = date?.getTime() !== new Date('0000-01-01T00:00:00').getTime();
    searchParameterModule.periodEnd = date ? { month: date.getMonth() + 1, day: date.getDate(), isValid } : null;
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

  public scrollOnFocus() {
    const wrapper = this.$el.querySelector('#scroll-on-focus');
    wrapper?.scrollIntoView(true);
  }
}
