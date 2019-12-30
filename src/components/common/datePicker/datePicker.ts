import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

export type DatePickerResult = Date | 'invalid' | null;

@Component
export default class DatePicker extends Vue {
    @Prop({ required: true })
    public value!: DatePickerResult;

    @Prop({ required: false, type: String, default: '1970-01-01' })
    public readonly start!: string;

    @Prop({ required: false, type: String, default: new Date().toISOString() })
    public readonly end!: string;

    @Prop({ required: false, default: ['year', 'month', 'day'] })
    public ariaLabels!: string[];

    @Prop({ required: false, default: true, type: Boolean })
    public readonly showYear!: boolean;

    @Prop({ required: false, type: Boolean })
    public emptied!: boolean;

    @Prop({ required: false, type: Boolean })
    public error!: boolean;

    public startDate = new Date(this.start);
    public endDate = new Date(this.end);
    public year: number = this.value ? (this.value as Date).getUTCFullYear() : -1;
    public month: number = this.value ? (this.value as Date).getUTCMonth() : -1;
    public day: number = this.value ? (this.value as Date).getUTCDate() : -1;
    public years: number[] = [];
    public months: number[] = [];
    public days: number[] = [];

    @Watch('emptied')
    public onEmptiedChanged(val: boolean, oldVal: boolean) {
        if (val !== oldVal) {
            this.year = -1;
            this.month = -1;
            this.day = -1;
        }
    }

    public created() {
        this.getYears();
        this.getMonths();
        this.getDays();
    }

    get currentResult(): DatePickerResult {
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
    }

    public emitUpdate() {
        this.$emit('input', this.currentResult);
    }

    public onChangeYear() {
        if (this.month === 1) {
            this.day = -1;
        }
        this.getMonths();
        this.getDays();
        this.emitUpdate();
    }

    public onChangeMonth() {
        if (this.month === 1) {
            this.day = -1;
        }
        this.getDays();
        this.emitUpdate();
    }

    private getYears() {
        const to = this.startDate.getFullYear();
        for (let y = this.endDate.getFullYear(); y >= to; y--) {
            this.years.push(y);
        }
    }

    private getMonths() {
        this.months = [];

        let to = 11;
        let m = 0;
        if (this.year >= this.endDate.getUTCFullYear()) {
            to = this.endDate.getUTCMonth();
        }
        if (this.year <= this.startDate.getUTCFullYear()) {
            m = this.startDate.getUTCMonth();
        }
        for (; m <= to; m++) {
            this.months.push(m);
        }
    }

    private getDays() {
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
        if (this.year <= this.startDate.getUTCFullYear() && this.month <= this.startDate.getUTCMonth()) {
            d = this.startDate.getUTCDate();
        }
        if (this.year >= this.endDate.getUTCFullYear() && this.month >= this.endDate.getUTCMonth()) {
            to = this.endDate.getUTCDate();
        }
        for (; d <= to; d++) {
            this.days.push(d);
        }
    }

    private daysInMonth = (month: number, year: number) => {
        // Returns the number of days in the selected month of the selected year
        return new Date(year, month + 1, 0).getDate();
    }
}
