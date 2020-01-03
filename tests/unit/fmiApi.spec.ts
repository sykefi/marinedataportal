import { getDates, getParams } from '@/apis/fmiApi';
import { CommonParameters } from '@/queries/commonParameters';
import { expect } from 'chai';

describe('Time parameters tests for fmi api', () => {
    it('returns correct time parameters when one day is picked', () => {
        const startDate = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
        const endDate = new Date(Date.UTC(2000, 1, 29, 0, 0, 0));
        const periodStart = null;
        const periodEnd = null;
        const expectedParams = ['&starttime=2000-02-29T00:00:00.000Z&endtime=2000-02-29T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
    it('returns correct time parameters when several days from subsequent years are picked', () => {
        const startDate = new Date(Date.UTC(1999, 11, 20, 0, 0, 0));
        const endDate = new Date(Date.UTC(2000, 0, 10, 0, 0, 0));
        const periodStart = null;
        const periodEnd = null;

        const expectedParams = ['&starttime=1999-12-20T00:00:00.000Z&endtime=1999-12-26T23:59:59.000Z&fmisid=1',
            '&starttime=1999-12-27T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2000-01-02T00:00:00.000Z&endtime=2000-01-07T23:59:59.000Z&fmisid=1',
            '&starttime=2000-01-08T00:00:00.000Z&endtime=2000-01-10T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
    it('returns correct time parameters when chosen time span is one day longer than numberOfDaysInSingleQuery', () => {
        const startDate = new Date(Date.UTC(1999, 11, 31, 0, 0, 0));
        const endDate = new Date(Date.UTC(2000, 0, 6, 0, 0, 0));
        const periodStart = null;
        const periodEnd = null;

        const expectedParams = ['&starttime=1999-12-31T00:00:00.000Z&endtime=2000-01-06T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
    it('returns correct time parameters when several years and one day time period are chosen', () => {
        const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(2003, 11, 31, 0, 0, 0));
        const periodStart = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
        const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

        const expectedParams = ['&starttime=2000-01-01T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2001-01-01T00:00:00.000Z&endtime=2001-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2002-01-01T00:00:00.000Z&endtime=2002-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2003-01-01T00:00:00.000Z&endtime=2003-01-01T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
    it('returns correct time parameters when several years and time period stretching from December till January are chosen', () => {
        const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(2003, 11, 31, 0, 0, 0));
        const periodStart = new Date(Date.UTC(2000, 11, 31, 0, 0, 0));
        const periodEnd = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));

        const expectedParams = ['&starttime=2000-01-01T00:00:00.000Z&endtime=2000-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2000-12-31T00:00:00.000Z&endtime=2001-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2001-12-31T00:00:00.000Z&endtime=2002-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2002-12-31T00:00:00.000Z&endtime=2003-01-01T23:59:59.000Z&fmisid=1',
            '&starttime=2003-12-31T00:00:00.000Z&endtime=2003-12-31T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
    it('returns correct time parameters when time period is two days longer than numberOfDaysInSingleQuery', () => {
        const startDate = new Date(Date.UTC(2000, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(2001, 11, 31, 0, 0, 0));
        const periodStart = new Date(Date.UTC(2000, 0, 31, 0, 0, 0));
        const periodEnd = new Date(Date.UTC(2000, 1, 7, 0, 0, 0));

        const expectedParams = ['&starttime=2000-01-31T00:00:00.000Z&endtime=2000-02-06T23:59:59.000Z&fmisid=1',
            '&starttime=2000-02-07T00:00:00.000Z&endtime=2000-02-07T23:59:59.000Z&fmisid=1',
            '&starttime=2001-01-31T00:00:00.000Z&endtime=2001-02-06T23:59:59.000Z&fmisid=1',
            '&starttime=2001-02-07T00:00:00.000Z&endtime=2001-02-07T23:59:59.000Z&fmisid=1'];

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

        const expectedParams = ['&starttime=2000-02-23T00:00:00.000Z&endtime=2000-02-29T23:59:59.000Z&fmisid=1',
            '&starttime=2001-02-23T00:00:00.000Z&endtime=2001-02-28T23:59:59.000Z&fmisid=1',
            '&starttime=2002-02-23T00:00:00.000Z&endtime=2002-02-28T23:59:59.000Z&fmisid=1',
            '&starttime=2003-02-23T00:00:00.000Z&endtime=2003-02-28T23:59:59.000Z&fmisid=1',
            '&starttime=2004-02-23T00:00:00.000Z&endtime=2004-02-29T23:59:59.000Z&fmisid=1'];

        testDateParams(startDate, endDate, periodStart, periodEnd, expectedParams);
    });
});

function testDateParams(startDate: Date, endDate: Date, periodStart: Date | null,
                        periodEnd: Date | null, expectedParams: string[]) {

    const numberOfDaysInSingleQuery = 6;
    const params = new CommonParameters(startDate, endDate, periodStart, periodEnd, []);
    const dateSpans = getDates(params, numberOfDaysInSingleQuery);
    let formattedParams: string[] = [];
    if (dateSpans) {
        formattedParams = getParams(dateSpans, numberOfDaysInSingleQuery, 1);
    }

    expect(formattedParams).to.have.lengthOf(expectedParams.length);
    for (let i = 0; i < expectedParams.length; i++) {
        expect(formattedParams[i]).equal(expectedParams[i]);
    }
}
