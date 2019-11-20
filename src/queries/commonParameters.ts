import { Site } from './site';
import { searchParameterModule } from '@/store/searchParameterModule';
import { ITimeSpanSelection } from '@/store/ITimeSpanSelection';

export class CommonParameters {
  public sites: Site[];
  private dateStart: Date;
  private dateEnd: Date;
  private datePeriodStart: ITimeSpanSelection | null;
  private datePeriodEnd: ITimeSpanSelection | null;
  // location
  // other options

  public get formattedDateStart() {
    return this.dateStart.toISOString();
  }

  public get formattedDateEnd() {
    return this.dateEnd.toISOString();
  }

  public get datePeriodMonths() {
    if (this.datePeriodStart && this.datePeriodEnd) {
      return { start: this.datePeriodStart.month, end: this.datePeriodEnd.month };
    }
    return null;
  }

  public get datePeriodStartDay() {
    return this.datePeriodStart?.day;
  }

  public get datePeriodEndDay() {
    return this.datePeriodEnd?.day;
  }

  /** Get a list of day numbers to query.
   * For a date period in the same month, returns [periodStartDay - periodEndDay]
   * For a date period of over a month, returns an empty list indicating the whole month
   */
  public get datePeriodDays() {
    if (!this.datePeriodStart || !this.datePeriodEnd) {
      return null;
    }
    const startMonth = this.datePeriodStart.month;
    const startDay = this.datePeriodStart.day;
    const endMonth = this.datePeriodEnd.month;
    const endDay = this.datePeriodEnd.day;
    const days: number[] = [];

    if (startMonth === endMonth) {
      // select certain days of the same month
      for (let i = startDay; i <= endDay; i++) {
        days.push(i);
      }
    }
    // if period is over a month, we would always produce a list of the full month
    // therefore we return an empty list to avoid useless query parameters
    return days;
  }

  constructor() {
    this.dateStart = searchParameterModule.timeSpanStart!;
    this.dateEnd = searchParameterModule.timeSpanEnd!;
    this.sites = searchParameterModule.selectedSites;
    this.datePeriodStart = searchParameterModule.periodStart;
    this.datePeriodEnd = searchParameterModule.periodEnd;
  }
}
