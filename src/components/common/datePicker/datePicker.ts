import { defineComponent, PropType } from 'vue';

export type DatePickerResult = Date | 'invalid' | null;

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<DatePickerResult>,
      required: false,
    },
    start: {
      type: String,
      required: false,
      default: '1970-01-01',
    },
    end: {
      type: String,
      required: false,
      default: new Date().toISOString(),
    },
    ariaLabels: {
      type: [String, Array],
      required: false,
      default: () => ['year', 'month', 'day'],
    },
    showYear: {
      type: Boolean,
      required: false,
      default: true,
    },
    emptied: {
      type: Boolean,
      required: false,
    },
    error: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      startDate: null as Date | null,
      endDate: null as Date | null,
      year: -1,
      month: -1,
      day: -1,
      years: [] as number[],
      months: [] as number[],
      days: [] as number[],
    };
  },
  watch: {
    emptied(val: boolean, oldVal: boolean) {
      if (val !== oldVal) {
        this.year = -1;
        this.month = -1;
        this.day = -1;
      }
    },
    startDateAndEndDate() {
      this.getYears();
      this.getMonths();
      this.getDays();
    },
  },
  created() {
    this.getYears();
    this.getMonths();
    this.getDays();
    this.startDate = new Date(this.start);
    this.endDate = new Date(this.end);
    this.year = this.modelValue
      ? (this.modelValue as Date).getUTCFullYear()
      : -1;
    this.month = this.modelValue ? (this.modelValue as Date).getUTCMonth() : -1;
    this.day = this.modelValue ? (this.modelValue as Date).getUTCDate() : -1;
  },
  computed: {
    startDateAndEndDate() {
      return `${this.startDate}${this.endDate}`;
    },
    currentResult(): DatePickerResult {
      if (this.showYear) {
        if (this.year > -1 && this.month > -1 && this.day > -1) {
          return new Date(Date.UTC(this.year, this.month, this.day, 0, 0, 0));
        } else {
          return null;
        }
      } else {
        if (this.month > -1 && this.day > -1) {
          return new Date(Date.UTC(2000, this.month, this.day, 0, 0, 0));
        } else if (this.month > -1 || this.day > -1) {
          // This is for checking if time period is incomplete
          return 'invalid';
        } else {
          return null;
        }
      }
    },
  },
  methods: {
    emitUpdate() {
      this.$emit('update:modelValue', this.currentResult);
    },
    onChangeYear() {
      if (this.month === 1) {
        this.day = -1;
      }
      this.getMonths();
      this.getDays();
      this.emitUpdate();
    },
    onChangeMonth() {
      if (this.month === 1) {
        this.day = -1;
      }
      this.getDays();
      this.emitUpdate();
    },
    getYears() {
      if (!this.startDate || !this.endDate) {
        return [];
      }
      const to = this.startDate.getFullYear();
      for (let y = this.endDate.getFullYear(); y >= to; y--) {
        this.years.push(y);
      }
    },
    getMonths() {
      this.months = [];

      let to = 11;
      let m = 0;
      if (this.showYear && this.endDate && this.startDate) {
        if (this.year >= this.endDate.getUTCFullYear()) {
          to = this.endDate.getUTCMonth();
        }
        if (this.year <= this.startDate.getUTCFullYear()) {
          m = this.startDate.getUTCMonth();
        }
      }
      for (; m <= to; m++) {
        this.months.push(m);
      }
    },
    getDays() {
      this.days = [];
      if (this.month === -1) {
        return;
      }
      let to;
      if (this.year === -1) {
        if (this.month === 1) {
          // If year is not picked, February always has 29 days.
          // this way we don't need to worry about leap years.
          to = 29;
        } else {
          to = this.daysInMonth(this.month, 2001);
        }
      } else {
        to = this.daysInMonth(this.month, this.year);
      }
      let d = 1;
      if (this.showYear && this.startDate && this.endDate) {
        if (
          this.year <= this.startDate.getUTCFullYear() &&
          this.month <= this.startDate?.getUTCMonth()
        ) {
          d = this.startDate?.getUTCDate() ?? 0;
        }
        if (
          this.year >= this.endDate.getUTCFullYear() &&
          this.month >= this.endDate.getUTCMonth()
        ) {
          to = this.endDate.getUTCDate();
        }
      }
      for (; d <= to; d++) {
        this.days.push(d);
      }
    },
    daysInMonth(month: number, year: number) {
      // Returns the number of days in the selected month of the selected year
      return new Date(year, month + 1, 0).getDate();
    },
  },
});
