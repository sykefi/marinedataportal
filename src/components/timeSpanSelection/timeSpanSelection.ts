
import { Component, Vue } from 'vue-property-decorator';
import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import EmptySelectionButton from '@/components/common/emptySelectionButton/EmptySelectionButton.vue';
import { searchParameterModule } from '@/store/searchParameterModule';
import { mainState } from '@/store/mainState';
import { DatePickerResult } from '../common/datePicker/datePicker';
@Component({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
})
export default class TimeSpanSelection extends Vue {
  public timeSpanStart: DatePickerResult = searchParameterModule.timeSpanStart;
  public timeSpanEnd: DatePickerResult = searchParameterModule.timeSpanEnd;
  public periodStart: DatePickerResult = searchParameterModule.periodStart;
  public periodEnd: DatePickerResult = searchParameterModule.periodEnd;
  public periodEmptied: boolean = false;

  get searchModule() {
    return searchParameterModule;
  }

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
