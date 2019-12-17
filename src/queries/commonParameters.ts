import { Site, SiteTypes } from './site';
import { searchParameterModule } from '@/store/searchParameterModule';
import { DatePickerResult } from '@/components/common/datePicker/datePicker';

export class CommonParameters {
  public readonly dateStart: Date;
  public readonly dateEnd: Date;
  private readonly datePeriodStart: DatePickerResult;
  private readonly datePeriodEnd: DatePickerResult;
  private readonly sites: Site[];

  public get veslaSites() {
    return this.sites.filter((s) => s.type === SiteTypes.Vesla);
  }

  public get mareographSites() {
    return this.sites.filter((s) => s.type === SiteTypes.Mareograph);
  }

  public get buoySites() {
    return this.sites.filter((s) => s.type === SiteTypes.FmiBuoy);
  }

  public get formattedDateStart() {
    return this.dateStart.toISOString();
  }

  public get formattedDateEnd() {
    return this.dateEnd.toISOString();
  }

  public get datePeriodMonths() {
    if (!this.datePeriodStart
      || !this.datePeriodEnd
      || this.datePeriodEnd === 'invalid'
      || this.datePeriodStart === 'invalid') {
      return null;
    }
    return { start: this.datePeriodStart.getMonth() + 1, end: this.datePeriodEnd.getMonth() + 1 };
  }

  public get datePeriodStartDay() {
    if (!this.datePeriodStart || this.datePeriodStart === 'invalid') {
      return null;
    }
    return this.datePeriodStart.getDate();
  }

  public get datePeriodEndDay() {
    if (!this.datePeriodEnd || this.datePeriodEnd === 'invalid') {
      return null;
    }
    return this.datePeriodEnd.getDate();
  }

  /** Get a list of day numbers to query.
   * For a date period in the same month, returns [periodStartDay - periodEndDay]
   * For a date period of over a month, returns an empty list indicating the whole month
   */
  public get datePeriodDays() {
    if (!this.datePeriodStart
      || !this.datePeriodEnd
      || this.datePeriodEnd === 'invalid'
      || this.datePeriodStart === 'invalid') {
      return null;
    }

    const startMonth = this.datePeriodStart.getMonth() + 1;
    const startDay = this.datePeriodStart.getDate();
    const endMonth = this.datePeriodEnd.getMonth() + 1;
    const endDay = this.datePeriodEnd.getDate();
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
    this.dateStart = searchParameterModule.timeSpanStart as Date;
    this.dateEnd = searchParameterModule.timeSpanEnd as Date;
    this.sites = searchParameterModule.selectedSites;
    this.datePeriodStart = searchParameterModule.periodStart;
    this.datePeriodEnd = searchParameterModule.periodEnd;
  }
}
