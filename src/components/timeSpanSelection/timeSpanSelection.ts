import SelectionHeader from '@/components/common/SelectionHeader.vue';
import DetailsButton from '@/components/common/detailsButton/DetailsButton.vue';
import DatePicker from '@/components/common/datePicker/DatePicker.vue';
import EmptySelectionButton from '@/components/common/emptySelectionButton/EmptySelectionButton.vue';
import { defineComponent } from 'vue';
import { useMainStateStore } from '@/stores/mainStateStore';
import { mapStores } from 'pinia';
import { useSearchParameterStore } from '@/stores/searchParameterStore';
import { DatePickerResult } from '../common/datePicker/datePicker';

export default defineComponent({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
  data() {
    return {
      periodEmptied: false,
    };
  },
  computed: {
    ...mapStores(useMainStateStore, useSearchParameterStore),
    timeSpanStart: {
      get() {
        return this.searchParameterStore.timeSpanStart;
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setTimeSpanStart(payload);
      },
    },
    timeSpanEnd: {
      get() {
        return this.searchParameterStore.timeSpanEnd;
      },
      set(payload: DatePickerResult) {
        this.searchParameterStore.setTimeSpanEnd(payload);
      },
    },
    periodStart: {
      get() {
        return this.searchParameterStore.periodStart;
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setPeriodStart(payload);
      },
    },
    periodEnd: {
      get() {
        return this.searchParameterStore.periodEnd;
      },
      set(payload: DatePickerResult | null) {
        this.searchParameterStore.setPeriodEnd(payload);
      },
    },
    timeSpanStartError() {
      return (
        this.mainStateStore.isError('$missingTimeSpanStart') ||
        this.mainStateStore.isError('$timeSpanStartAfterTimeSpanEnd')
      );
    },
    timeSpanEndError() {
      return (
        this.mainStateStore.isError('$missingTimeSpanEnd') ||
        this.mainStateStore.isError('$timeSpanStartAfterTimeSpanEnd')
      );
    },
    periodEndError() {
      return (
        this.mainStateStore.isError('$missingPeriodEnd') ||
        this.mainStateStore.isError('$incompletePeriodEnd')
      );
    },
    periodStartError() {
      return (
        this.mainStateStore.isError('$missingPeriodStart') ||
        this.mainStateStore.isError('$incompletePeriodStart')
      );
    },
  },
  methods: {
    resetPeriodStart() {
      this.searchParameterStore.periodStart = null;
    },
    resetPeriodEnd() {
      this.searchParameterStore.periodEnd = null;
    },
    emptyPeriodSelection() {
      this.resetPeriodStart();
      this.resetPeriodEnd();
      this.periodEmptied = !this.periodEmptied;
    },
  },
});
