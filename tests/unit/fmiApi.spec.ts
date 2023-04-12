import {
  getDates,
  getParams,
  IFmiResult,
  sortByTimeAndParameters,
} from '@/apis/fmiApi';
import { CommonParameters } from '@/queries/commonParameters';
import { expect } from 'chai';
import { SearchParameterModule } from '@/store/searchParameterModule';
import Vuex from 'vuex';

describe('Time parameters tests for fmi api', () => {
  it('returns correct time parameters when one day is picked', () => {
    const startDate = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
    const endDate = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
    const periodStart = null;
    const periodEnd = null;
    const expectedParams = [
      '&starttime=2000-02-29T00:00:00.000Z&endtime=2000-02-29T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when several days from subsequent years are picked', () => {
    const startDate = new Date(Date.UTC(1999, 11, 20, 0, 0, 0));
    const endDate = new Date(Date.UTC(2000, 0, 10, 0, 0, 0));
    const periodStart = null;
    const periodEnd = null;

    const expectedParams = [
      '&starttime=1999-12-20T00:00:00.000Z&endtime=1999-12-26T23:59:59.000Z&fmisid=1',
      '&starttime=1999-12-27T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2000-01-02T00:00:00.000Z&endtime=2000-01-07T23:59:59.000Z&fmisid=1',
      '&starttime=2000-01-08T00:00:00.000Z&endtime=2000-01-10T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when chosen time span is one day longer than numberOfDaysInSingleQuery', () => {
    const startDate = new Date(Date.UTC(1999, 11, 31, 0, 0, 0));
    const endDate = new Date(Date.UTC(2000, 0, 6, 0, 0, 0));
    const periodStart = null;
    const periodEnd = null;

    const expectedParams = [
      '&starttime=1999-12-31T00:00:00.000Z&endtime=2000-01-06T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when several years and one day time period are chosen', () => {
    const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2003, 11, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

    const expectedParams = [
      '&starttime=2000-01-01T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2001-01-01T00:00:00.000Z&endtime=2001-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2002-01-01T00:00:00.000Z&endtime=2002-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2003-01-01T00:00:00.000Z&endtime=2003-01-01T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when several years and time period stretching from December till January are chosen', () => {
    const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2003, 11, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 11, 31, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

    const expectedParams = [
      '&starttime=2000-01-01T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2000-12-31T00:00:00.000Z&endtime=2001-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2001-12-31T00:00:00.000Z&endtime=2002-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2002-12-31T00:00:00.000Z&endtime=2003-01-01T23:59:59.000Z&fmisid=1',
      '&starttime=2003-12-31T00:00:00.000Z&endtime=2003-12-31T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when time period is two days longer than numberOfDaysInSingleQuery', () => {
    const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2001, 11, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 0, 31, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 1, 7, 0, 0, 0));

    const expectedParams = [
      '&starttime=2000-01-31T00:00:00.000Z&endtime=2000-02-06T23:59:59.000Z&fmisid=1',
      '&starttime=2000-02-07T00:00:00.000Z&endtime=2000-02-07T23:59:59.000Z&fmisid=1',
      '&starttime=2001-01-31T00:00:00.000Z&endtime=2001-02-06T23:59:59.000Z&fmisid=1',
      '&starttime=2001-02-07T00:00:00.000Z&endtime=2001-02-07T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns no time parameters when chosen time span and time period do not intersect', () => {
    const startDate = new Date(Date.UTC(2000, 0, 2, 0, 0, 0));
    const endDate = new Date(Date.UTC(2000, 11, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

    const expectedParams: string[] = [];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when leap day is included in time period parameters', () => {
    const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2004, 11, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 1, 23, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));

    const expectedParams = [
      '&starttime=2000-02-23T00:00:00.000Z&endtime=2000-02-29T23:59:59.000Z&fmisid=1',
      '&starttime=2001-02-23T00:00:00.000Z&endtime=2001-02-28T23:59:59.000Z&fmisid=1',
      '&starttime=2002-02-23T00:00:00.000Z&endtime=2002-02-28T23:59:59.000Z&fmisid=1',
      '&starttime=2003-02-23T00:00:00.000Z&endtime=2003-02-28T23:59:59.000Z&fmisid=1',
      '&starttime=2004-02-23T00:00:00.000Z&endtime=2004-02-29T23:59:59.000Z&fmisid=1',
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when end date is unchanged and start date is today', () => {
    const store = new Vuex.Store({ strict: true });
    const module = new SearchParameterModule({
      store,
      name: 'testSearchParameters',
    });

    const today = new Date();
    const startDate = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
    );
    const endDate = module.timeSpanEnd as Date;
    const periodStart = null;
    const periodEnd = null;

    const expectedDate = today.toISOString().substr(0, 10);
    const expectedParams = [
      `&starttime=${expectedDate}T00:00:00.000Z&endtime=${expectedDate}T23:59:59.000Z&fmisid=1`,
    ];

    testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
  });
  it('returns correct time parameters when period start and period end are within the same month but in subsequent years', () => {
    const startDate = new Date(Date.UTC(2000, 0, 2, 0, 0, 0));
    const endDate = new Date(Date.UTC(2001, 0, 31, 0, 0, 0));
    const periodStart = new Date(Date.UTC(2000, 0, 31, 0, 0, 0));
    const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

    const numberOfDaysInSingleQuery = 6;
    const params = new CommonParameters(
      startDate,
      endDate,
      periodStart,
      periodEnd,
      []
    );
    const dateSpans = getDates(params, numberOfDaysInSingleQuery);
    let formattedParams: string[] = [];
    if (dateSpans) {
      formattedParams = getParams(dateSpans, numberOfDaysInSingleQuery, 1);
    }

    expect(formattedParams).to.have.length(57);
    expect(formattedParams[0]).equal(
      '&starttime=2000-01-31T00:00:00.000Z&endtime=2000-02-06T23:59:59.000Z&fmisid=1'
    );
    expect(formattedParams[55]).equal(
      '&starttime=2000-12-27T00:00:00.000Z&endtime=2001-01-01T23:59:59.000Z&fmisid=1'
    );
    expect(formattedParams[56]).equal(
      '&starttime=2001-01-31T00:00:00.000Z&endtime=2001-01-31T23:59:59.000Z&fmisid=1'
    );
  });
});

function testDateParams(
  startDate: Date,
  endDate: Date,
  periodStart: Date | null,
  periodEnd: Date | null,
  expectedParams: string[]
) {
  const numberOfDaysInSingleQuery = 6;
  const params = new CommonParameters(
    startDate,
    endDate,
    periodStart,
    periodEnd,
    []
  );
  const dateSpans = getDates(params, numberOfDaysInSingleQuery);
  let formattedParams: string[] = [];
  if (dateSpans) {
    formattedParams = getParams(dateSpans, numberOfDaysInSingleQuery, 1);
  }
  compareArrays(formattedParams, expectedParams);
}

export function compareArrays(a1: any[], a2: any[]) {
  expect(a1).to.have.lengthOf(a2.length);
  for (let i = 0; i < a2.length; i++) {
    expect(a1[i]).to.deep.equal(a2[i]);
  }
}

describe('Sorting of fmi api responses', () => {
  it('returns responses in correct order', () => {
    const sortedResults = [
      getIFmiResult('2000-01-02', 'test2', 3),
      getIFmiResult('2000-01-01', 'test2', 1),
      getIFmiResult('2000-01-01', 'test2', 3),
      getIFmiResult('2000-01-02', 'test2', 1),
      getIFmiResult('2000-01-01', 'test1', 1),
      getIFmiResult('2000-01-02', 'test2', 2),
      getIFmiResult('2000-01-01', 'test1', 2),
      getIFmiResult('2000-01-01', 'test1', 3),
      getIFmiResult('2000-01-01', 'test2', 2),
    ].sort(sortByTimeAndParameters);

    const expectedResults = [
      getIFmiResult('2000-01-01', 'test1', 1),
      getIFmiResult('2000-01-01', 'test1', 2),
      getIFmiResult('2000-01-01', 'test1', 3),
      getIFmiResult('2000-01-01', 'test2', 1),
      getIFmiResult('2000-01-02', 'test2', 1),
      getIFmiResult('2000-01-01', 'test2', 2),
      getIFmiResult('2000-01-02', 'test2', 2),
      getIFmiResult('2000-01-01', 'test2', 3),
      getIFmiResult('2000-01-02', 'test2', 3),
    ];

    compareArrays(sortedResults, expectedResults);
  });
});

function getIFmiResult(
  time: string,
  parameterName: string,
  siteId: number
): IFmiResult {
  return {
    time,
    parameterName,
    value: '0',
    lat: 0,
    long: 0,
    siteId,
    siteName: '',
    dataSource: '',
  };
}
