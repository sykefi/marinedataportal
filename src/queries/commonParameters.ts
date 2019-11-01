export class CommonParameters {
  private dateStart: Date;
  private dateEnd: Date;
  // location
  // other options

  public get formattedDateStart() {
    return this.dateStart.toISOString().substring(0, 10);
  }

  public get formattedDateEnd() {
    return this.dateEnd.toISOString().substring(0, 10);
  }

  constructor(dateStart: Date, dateEnd: Date) {
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
  }
}