import { Site } from './site';

export class CommonParameters {
  public sites: Site[];
  private dateStart: Date;
  private dateEnd: Date;
  // location
  // other options

  public get formattedDateStart() {
    return this.dateStart.toISOString();
  }

  public get formattedDateEnd() {
    return this.dateEnd.toISOString();
  }

  constructor(dateStart: Date, dateEnd: Date, sites: Site[]) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.sites = sites;
  }
}
