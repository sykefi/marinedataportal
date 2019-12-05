import { Site, SiteTypes } from './site';
import { DepthOptions } from '@/store/searchParameterModule';
import { searchParameterModule } from '@/store/searchParameterModule';
import { ITimeSpanSelection } from '@/store/ITimeSpanSelection';

export class CommonParameters {
  public readonly depthSelection: DepthOptions;
  public readonly depthStart: number | null;
  public readonly depthEnd?: number | null;
  public readonly dateStart: Date;
  public readonly dateEnd: Date;
  private readonly datePeriodStart: ITimeSpanSelection | null;
  private readonly datePeriodEnd: ITimeSpanSelection | null;
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
    this.depthSelection = searchParameterModule.selectedDepth;
    this.depthStart = searchParameterModule.depthStart;
    this.depthEnd = searchParameterModule.depthEnd;
  }
}
