import SelectionHeader from "@/components/common/SelectionHeader.vue";
import DetailsButton from "@/components/common/detailsButton/DetailsButton.vue";
import DatePicker from "@/components/common/datePicker/DatePicker.vue";
import EmptySelectionButton from "@/components/common/emptySelectionButton/EmptySelectionButton.vue";
import { searchParameterModule } from "@/store/searchParameterModule";
import { mainState } from "@/store/mainState";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    SelectionHeader,
    DetailsButton,
    DatePicker,
    EmptySelectionButton,
  },
  data() {
    return {
      timeSpanStart: searchParameterModule.timeSpanStart,
      timeSpanEnd: searchParameterModule.timeSpanEnd,
      periodStart: searchParameterModule.periodStart,
      periodEnd: searchParameterModule.periodEnd,
      periodEmptied: false,
    };
  },
  computed: {
    searchModule() {
      return searchParameterModule;
    },
    timeSpanStartError() {
      return (
        mainState.isError("$missingTimeSpanStart") ||
        mainState.isError("$timeSpanStartAfterTimeSpanEnd")
      );
    },
    timeSpanEndError() {
      return (
        mainState.isError("$missingTimeSpanEnd") ||
        mainState.isError("$timeSpanStartAfterTimeSpanEnd")
      );
    },
    periodEndError() {
      return (
        mainState.isError("$missingPeriodEnd") ||
        mainState.isError("$incompletePeriodEnd")
      );
    },
    periodStartError() {
      return (
        mainState.isError("$missingPeriodStart") ||
        mainState.isError("$incompletePeriodStart")
      );
    },
  },
  methods: {
    resetPeriodStart() {
      searchParameterModule.periodStart = null;
    },
    resetPeriodEnd() {
      searchParameterModule.periodEnd = null;
    },
    emptyPeriodSelection() {
      this.resetPeriodStart();
      this.resetPeriodEnd();
      this.periodEmptied = !this.periodEmptied;
    },
  },
});
