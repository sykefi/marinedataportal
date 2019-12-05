import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class DatePicker extends Vue {
    @Prop({ required: false, type: String, default: '1900-01-01' })
    public readonly start!: string;
    @Prop({ required: false, type: Date })
    public readonly defaultDate!: Date;
    @Prop({ required: false, type: String, default: '2020-12-31' })
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
    public year: number = this.defaultDate ? this.defaultDate.getFullYear() : -1;
    public month: number = this.defaultDate ? this.defaultDate.getMonth() : -1;
    public day: number = this.defaultDate ? this.defaultDate.getDate() : -1;
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

    public emitUpdate() {
        if (this.showYear) {
            if (this.year > -1 && this.month > -1 && this.day > -1) {
                this.$emit('date-change', new Date(this.year + '-' + (this.month + 1) + '-' + this.day));
            } else {
                this.$emit('date-change', null);
            }
        } else {
            if (this.month > -1 && this.day > -1) {
                this.$emit('date-change', new Date('2000-' + (this.month + 1) + '-' + this.day));
            } else if (this.month > -1 || this.day > -1) {
                // This is for checking if time period is incomplete
                this.$emit('date-change', new Date('0000-01-01T00:00:00'));
            } else {
                this.$emit('date-change', null);
            }
        }
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
        if (this.year >= this.endDate.getFullYear()) {
            to = this.endDate.getMonth();
        }
        if (this.year <= this.startDate.getFullYear()) {
            m = this.startDate.getMonth();
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
        if (this.year <= this.startDate.getFullYear() && this.month <= this.startDate.getMonth()) {
            d = this.startDate.getDate();
        }
        if (this.year >= this.endDate.getFullYear() && this.month >= this.endDate.getMonth()) {
            to = this.endDate.getDate();
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
