// tslint:disable:no-unused-expression
// tslint:disable: max-line-length
import {
  getTimeParametersForVeslaFilter,
  isDateInPeriod,
  validateSearchParameters,
  toFmiFormat,
  toCommonFormat,
  fromObservationToSykeFormat,
  fromWaterQualityResultToSykeFormat,
} from '@/helpers';
import { CommonParameters } from '@/queries/commonParameters';
import { expect } from 'chai';
import { SiteTypes } from '@/queries/site';
import { IFmiResult } from '@/apis/fmiApi';
import { useWaterLevelStore } from '@/stores/waterLevelStore';

describe('Time parameters tests for Vesla', () => {
  it('returns correct time parameters when one day is picked', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
      new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
      null,
      null,
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 2000-02-29T00:00:00.000Z and Time le 2000-02-29T23:59:59.000Z';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns correct time parameters when several days from subsequent years are picked', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(1999, 11, 20, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 10, 0, 0, 0)),
      null,
      null,
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 1999-12-20T00:00:00.000Z and Time le 2000-01-10T23:59:59.000Z';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns correct time parameters when several years and one day time period are chosen', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2003, 11, 31, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2003-12-31T23:59:59.000Z and (month(Time) ge 1 and month(Time) le 1) and day(Time) eq 1';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns correct time parameters when several years and time period stretching from December till January are chosen', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2003, 11, 31, 0, 0, 0)),
      new Date(Date.UTC(2000, 11, 31, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2003-12-31T23:59:59.000Z and (month(Time) ge 12 or month(Time) le 1)';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns correct time parameters when leap day is included in time period parameters', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2004, 11, 31, 0, 0, 0)),
      new Date(Date.UTC(2000, 1, 23, 0, 0, 0)),
      new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2004-12-31T23:59:59.000Z and (month(Time) ge 2 and month(Time) le 2) and day(Time) in (23,24,25,26,27,28,29)';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns correct time parameters when period start and end days are in the same month but in subsequent years', () => {
    const params = new CommonParameters(
      new Date(Date.UTC(2019, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2020, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2000, 5, 2, 0, 0, 0)),
      new Date(Date.UTC(2000, 5, 1, 0, 0, 0)),
      []
    );
    const formattedParams = getTimeParametersForVeslaFilter(params);

    const expectedParams =
      ' and Time ge 2019-01-01T00:00:00.000Z and Time le 2020-01-01T23:59:59.000Z and (month(Time) ge 6 or month(Time) le 6)';
    expect(formattedParams).equal(expectedParams);
  });
  it('returns true when the date is within a time period of two months in the same year', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
      new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 31, params);

    expect(actualResult).true;
  });
  it('returns true when the date is within a time period of two months in subsequent years', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 11, 1, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 31, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 1, params);

    expect(actualResult).true;
  });
  it('returns false when the date is not within a time period of two months in the same year', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
      new Date(Date.UTC(2000, 2, 1, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 1, params);

    expect(actualResult).false;
  });
  it('returns true when the date is a leap day and time period stretches over the leap day', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 11, 1, 0, 0, 0)),
      new Date(Date.UTC(2000, 4, 1, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(2, 29, params);

    expect(actualResult).true;
  });
  it('returns false when the date, period start, and period end are within the same month but the date is after the time period', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 3, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 4, params);

    expect(actualResult).false;
  });
  it('returns false when the date, period start, and period end are within the same month but the date is before the time period', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 3, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 1, params);

    expect(actualResult).false;
  });
  it('returns true when the date, period start, and period end are within the same month and the date is within the time period', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 3, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 2, params);

    expect(actualResult).true;
  });
  it('returns true when period start and period end are within the same month but in subsequent years and the date is within the time period', () => {
    const params = new CommonParameters(
      null,
      null,
      new Date(Date.UTC(2000, 0, 4, 0, 0, 0)),
      new Date(Date.UTC(2000, 0, 3, 0, 0, 0)),
      []
    );
    const actualResult = isDateInPeriod(1, 1, params);

    expect(actualResult).true;
  });
});

describe('search parameter validation', () => {
  it('shows all errors for empty data ', () => {
    const errors = validateSearchParameters(
      true,
      [],
      [],
      null,
      null,
      null,
      null
    );
    expect(errors).contains('$noSitesSelected');
    expect(errors).contains('$noAttributesSelected');
    expect(errors).contains('$missingTimeSpanStart');
    expect(errors).contains('$missingTimeSpanEnd');
  });
  it('does not require sites before they are fetched', () => {
    const errors = validateSearchParameters(
      false,
      [],
      [],
      null,
      null,
      null,
      null
    );
    expect(errors).not.contains('$noSitesSelected');
  });
  it('expects at least one selected site when fetching data', () => {
    let errors = validateSearchParameters(true, [], [], null, null, null, null);
    expect(errors).contains('$noSitesSelected');
    errors = validateSearchParameters(
      true,
      [
        {
          id: 1,
          name: 'test site',
          displayName: 'display name',
          lat: 31,
          long: 12,
          depth: null,
          type: SiteTypes.Vesla,
          mapCoordinates: [],
        },
      ],
      [],
      null,
      null,
      null,
      null
    );
    expect(errors).not.contains('$noSitesSelected');
  });
  it('expects at least one selected attribute module', () => {
    const waterLevelStore = useWaterLevelStore();
    const errors = validateSearchParameters(
      false,
      [],
      [waterLevelStore],
      null,
      null,
      null,
      null
    );
    expect(errors).not.contains('$noAttributesSelected');
  });
  it('expects start date to be earlier than end date', () => {
    let errors = validateSearchParameters(
      true,
      [],
      [],
      new Date(2012, 1, 1),
      new Date(),
      null,
      null
    );
    expect(errors).not.contains('$timeSpanStartAfterTimeSpanEnd');

    errors = validateSearchParameters(
      true,
      [],
      [],
      new Date(2100, 1, 1),
      new Date(),
      null,
      null
    );
    expect(errors).contains('$timeSpanStartAfterTimeSpanEnd');
  });
  it('expects start and end date to be set', () => {
    let errors = validateSearchParameters(true, [], [], null, null, null, null);
    expect(errors).contains('$missingTimeSpanStart');
    expect(errors).contains('$missingTimeSpanEnd');

    const startDate = new Date();
    startDate.setDate(-1);
    errors = validateSearchParameters(
      true,
      [],
      [],
      startDate,
      new Date(),
      null,
      null
    );

    expect(errors).not.contains('$missingTimeSpanStart');
    expect(errors).not.contains('$missingTimeSpanEnd');
  });
  it('properly validates time period', () => {
    let errors = validateSearchParameters(
      true,
      [],
      [],
      null,
      null,
      new Date(),
      null
    );

    expect(errors).contains('$missingPeriodEnd');
    errors = validateSearchParameters(
      true,
      [],
      [],
      null,
      null,
      null,
      new Date()
    );

    expect(errors).contains('$missingPeriodStart');

    errors = validateSearchParameters(
      true,
      [],
      [],
      null,
      null,
      'invalid',
      'invalid'
    );
    expect(errors).contains('$incompletePeriodStart');
    expect(errors).contains('$incompletePeriodEnd');

    errors = validateSearchParameters(
      true,
      [],
      [],
      null,
      null,
      new Date(2002, 1, 3),
      new Date(2002, 3, 7)
    );
    expect(errors).not.contains('$incompletePeriodStart');
    expect(errors).not.contains('$incompletePeriodEnd');
  });
});

describe('IResponseFormat validation', () => {
  const time = '2000-01-01T00:00:00.000Z';
  const analyteName = 'test analyte';
  const unit = '°C';
  const value = '0.2';
  const lat = 59.91683;
  const long = 25.597;
  const siteId = 123;
  const siteName = 'test site';
  const dataSource = 'FMI';
  const sampleDepth = '10';
  const siteDepth = 10;

  const fmiResult: IFmiResult = {
    time,
    parameterName: 'test',
    value,
    lat,
    long,
    siteId,
    siteName,
    dataSource,
  };

  it('returns correct fmi format for fmi result', () => {
    const fmiFormat = toFmiFormat(fmiResult, analyteName, unit);

    const expResult = {
      time,
      analyteName,
      value,
      unit,
      siteId,
      site: siteName,
      siteLatitudeWGS84: lat.toPrecision(7),
      siteLongitudeWGS84: long.toPrecision(7),
      dataSource,
    };

    expect(fmiFormat).to.deep.equal(expResult);
  });
  it('returns correct common format for fmi result', () => {
    const commonFormat = toCommonFormat(fmiResult, analyteName, unit);

    const expResult = {
      time,
      analyteName,
      value,
      unit,
      siteId,
      site: siteName,
      siteLatitudeWGS84: lat.toPrecision(7),
      siteLongitudeWGS84: long.toPrecision(7),
      samplingLatitudeWGS84: null,
      samplingLongitudeWGS84: null,
      sampleDepthM: null,
      sampleDepthUpperM: null,
      sampleDepthLowerM: null,
      siteDepthM: null,
      totalDepthM: null,
      laboratory: null,
      dataSource,
    };

    expect(commonFormat).to.deep.equal(expResult);
  });
  it('returns correct syke format for syke observation result', () => {
    const observationResult = {
      dataSource,
      parameterNameEng: analyteName,
      site: {
        depth: siteDepth,
        latitude: lat,
        longitude: long,
      },
      siteId,
      siteName,
      time,
      unit,
      value,
    };

    const sykeFormat = fromObservationToSykeFormat(observationResult);

    const expResult = {
      time,
      analyteName,
      value,
      unit,
      siteId,
      site: siteName,
      siteLatitudeWGS84: lat.toPrecision(7),
      siteLongitudeWGS84: long.toPrecision(7),
      siteDepthM: siteDepth.toString(),
      dataSource,
    };

    expect(sykeFormat).to.deep.equal(expResult);
  });
  it('returns correct syke format for syke water quality result', () => {
    const waterQualityResult = {
      time,
      analyteName,
      value,
      unit,
      siteId,
      site: siteName,
      siteLatitudeWGS84: lat,
      siteLongitudeWGS84: long,
      samplingLatitudeWGS84: null,
      samplingLongitudeWGS84: null,
      sampleDepthM: sampleDepth,
      sampleDepthUpperM: sampleDepth,
      sampleDepthLowerM: null,
      siteDepthM: siteDepth,
      totalDepthM: null,
      laboratory: null,
      dataSource,
    };

    const sykeFormat = fromWaterQualityResultToSykeFormat(waterQualityResult);

    const expResult = {
      time,
      analyteName,
      value: value.toString(),
      unit,
      siteId,
      site: siteName,
      siteLatitudeWGS84: lat.toPrecision(7),
      siteLongitudeWGS84: long.toPrecision(7),
      samplingLatitudeWGS84: undefined,
      samplingLongitudeWGS84: undefined,
      sampleDepthM: sampleDepth.toString(),
      sampleDepthUpperM: sampleDepth.toString(),
      sampleDepthLowerM: undefined,
      siteDepthM: siteDepth.toString(),
      totalDepthM: undefined,
      laboratory: null,
      dataSource,
    };

    expect(sykeFormat).to.deep.equal(expResult);
  });
});
