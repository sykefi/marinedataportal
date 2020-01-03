// tslint:disable:no-unused-expression
import { getTimeParametersForVeslaFilter, isDateInPeriod } from '@/helpers';
import { CommonParameters } from '@/queries/commonParameters';
import { expect } from 'chai';

describe('Time parameters tests for Vesla', () => {
    it('returns correct time parameters when one day is picked', () => {
        const params = new CommonParameters(
            new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
            new Date(Date.UTC(2000, 1, 29, 0, 0, 0)),
            null, null, []);
        const formattedParams = getTimeParametersForVeslaFilter(params);

        const expectedParams = ' and Time ge 2000-02-29T00:00:00.000Z and Time le 2000-02-29T23:59:59.000Z';
        expect(formattedParams).equal(expectedParams);
    });
    it('returns correct time parameters when several days from subsequent years are picked', () => {
        const params = new CommonParameters(
            new Date(Date.UTC(1999, 11, 20, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 10, 0, 0, 0)),
            null, null, []);
        const formattedParams = getTimeParametersForVeslaFilter(params);

        const expectedParams = ' and Time ge 1999-12-20T00:00:00.000Z and Time le 2000-01-10T23:59:59.000Z';
        expect(formattedParams).equal(expectedParams);
    });
    it('returns correct time parameters when several years and one day time period are chosen', () => {
        const params = new CommonParameters(
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
            new Date(Date.UTC(2003, 11, 31, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)), []);
        const formattedParams = getTimeParametersForVeslaFilter(params);

        const expectedParams = ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2003-12-31T23:59:59.000Z and (month(Time) ge 1 and month(Time) le 1) and day(Time) eq 1';
        expect(formattedParams).equal(expectedParams);
    });
    it('returns correct time parameters when several years and time period stretching from December till January are chosen', () => {
        const params = new CommonParameters(
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
            new Date(Date.UTC(2003, 11, 31, 0, 0, 0)),
            new Date(Date.UTC(2000, 11, 31, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)), []);
        const formattedParams = getTimeParametersForVeslaFilter(params);

        const expectedParams = ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2003-12-31T23:59:59.000Z and (month(Time) ge 12 or month(Time) le 1)';
        expect(formattedParams).equal(expectedParams);
    });
    it('returns correct time parameters when leap day is included in time period parameters', () => {
        const params = new CommonParameters(
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
            new Date(Date.UTC(2004, 11, 31, 0, 0, 0)),
            new Date(Date.UTC(2000, 1, 23, 0, 0, 0)),
            new Date(Date.UTC(2000, 1, 29, 0, 0, 0)), []);
        const formattedParams = getTimeParametersForVeslaFilter(params);

        const expectedParams = ' and Time ge 2000-01-01T00:00:00.000Z and Time le 2004-12-31T23:59:59.000Z and (month(Time) ge 2 and month(Time) le 2) and day(Time) in (23,24,25,26,27,28,29)';
        expect(formattedParams).equal(expectedParams);
    });
    it('returns true when the date is within a time period of two months in the same year', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 0, 1, 0, 0, 0)),
            new Date(Date.UTC(2000, 1, 29, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 31, params);

        expect(actualResult).true;
    });
    it('returns true when the date is within a time period of two months in subsequent years', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 11, 1, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 31, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 1, params);

        expect(actualResult).true;
    });
    it('returns false when the date is not within a time period of two months in the same year', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
            new Date(Date.UTC(2000, 2, 1, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 1, params);

        expect(actualResult).false;
    });
    it('returns true when the date is a leap day and time period stretches over the leap day', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 11, 1, 0, 0, 0)),
            new Date(Date.UTC(2000, 4, 1, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(2, 29, params);

        expect(actualResult).true;
    });
    it('returns false when the date, start month, and end month are within the same month but the date is after the time period', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 3, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 4, params);

        expect(actualResult).false;
    });
    it('returns false when the date, start month, and end month are within the same month but the date is before the time period', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 3, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 1, params);

        expect(actualResult).false;
    });
    it('returns true when the date, start month, and end month are within the same month and the date is within the time period', () => {
        const params = new CommonParameters(
            null, null,
            new Date(Date.UTC(2000, 0, 2, 0, 0, 0)),
            new Date(Date.UTC(2000, 0, 3, 0, 0, 0)), []);
        const actualResult = isDateInPeriod(1, 2, params);

        expect(actualResult).true;
    });
});
