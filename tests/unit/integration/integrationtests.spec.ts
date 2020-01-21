import { CommonParameters } from '@/queries/commonParameters';
import { Site, SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { compareArrays } from '@/../tests/unit/fmiApi.spec';
import { SurfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
import { IceThicknessModule } from '@/store/attributeModules/iceThicknessModule';
import Vuex from 'vuex';
import * as sinon from 'sinon';
import * as sykeApi from '@/apis/sykeApi';
import { IFmiResult } from '@/apis/fmiApi';
import * as fmiApi from '@/apis/fmiApi';

describe('Integration tests for surface temperature module', () => {
    const store = new Vuex.Store({ strict: true });
    const module = new SurfaceTemperatureModule({ store, name: 'testSurfaceTemperature' });

    it('returns correct results when surface temperature is queried', async () => {
        const veslaApiResponse: Promise<any[] | null> = new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        time: '2019-01-26T22:18:00+02:00',
                        analyteName: 'Temperature',
                        value: 2.229,
                        unit: '°C',
                        siteId: 70676,
                        site: 'SR5',
                        siteLatitudeWGS84: 61.08333,
                        siteLongitudeWGS84: 19.58333,
                        samplingLatitudeWGS84: 61.08323,
                        samplingLongitudeWGS84: 19.57952,
                        sampleDepthM: '1.0',
                        sampleDepthUpperM: 1,
                        sampleDepthLowerM: null,
                        siteDepthM: 126,
                        totalDepthM: 121,
                        laboratory: 'Suomen ympäristökeskus (R/V Aranda)',
                        dataSource: 'SYKE',
                    },
                ]);
            }, 0);
        });
        const fmiApiResponse: Promise<IFmiResult[]> = new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        time: '2019-01-26T00:00:00.000Z',
                        parameterName: 'TW_PT1H_AVG',
                        value: '-0.5',
                        lat: 60.20579,
                        long: 25.62509,
                        siteId: 100669,
                        siteName: 'Porvoo Emäsalo Vaarlahti',
                        dataSource: 'FMI',
                    },
                ]);
            }, 0);
        });
        const veslaApiStub = sinon.stub(sykeApi, 'default').returns(veslaApiResponse);
        const fmiApiStub = sinon.stub(fmiApi, 'GetSimpleFmiResponse').returns(fmiApiResponse);

        const startDate = new Date(Date.UTC(2019, 0, 26, 0, 0, 0));
        const endDate = new Date(Date.UTC(2019, 0, 26, 0, 0, 0));
        const periodStart = null;
        const periodEnd = null;
        const sites = [new Site(70676, 'SR5', 61.08333, 19.58333, 126, SiteTypes.Vesla),
        new Site(100669, 'Porvoo Emäsalo Vaarlahti', 60.20579, 25.62509, null, SiteTypes.Mareograph)];
        const params = new CommonParameters(startDate, endDate, periodStart, periodEnd, sites);

        await module.getData(params);
        const actualResults = module.data!;

        const expectedResults: IResponseFormat[] = [{
            time: '2019-01-26T22:18:00+02:00',
            analyteName: 'Temperature',
            value: '2.229',
            unit: '°C',
            siteId: 70676,
            site: 'SR5',
            siteLatitudeWGS84: '61.08333',
            siteLongitudeWGS84: '19.58333',
            samplingLatitudeWGS84: '61.08323',
            samplingLongitudeWGS84: '19.57952',
            sampleDepthM: '1.0',
            sampleDepthUpperM: '1',
            sampleDepthLowerM: undefined,
            siteDepthM: '126',
            totalDepthM: '121',
            laboratory: 'Suomen ympäristökeskus (R/V Aranda)',
            dataSource: 'SYKE',
        },
        {
            time: '2019-01-26T00:00:00.000Z',
            analyteName: 'Temperature',
            value: '-0.5',
            unit: '°C',
            siteId: 100669,
            site: 'Porvoo Emäsalo Vaarlahti',
            siteLatitudeWGS84: '60.20579',
            siteLongitudeWGS84: '25.62509',
            samplingLatitudeWGS84: null,
            samplingLongitudeWGS84: null,
            sampleDepthM: null,
            sampleDepthUpperM: null,
            sampleDepthLowerM: null,
            siteDepthM: null,
            totalDepthM: null,
            laboratory: null,
            dataSource: 'FMI',
        }];

        compareArrays(actualResults, expectedResults);

        veslaApiStub.restore();
        fmiApiStub.restore();
    });
});

describe('Integration tests for ice thickness module', () => {
    const store = new Vuex.Store({ strict: true });
    const module = new IceThicknessModule({ store, name: 'testIceThickness' });

    it('returns correct results when ice thickness is queried', async () => {
        const stubResponse: Promise<any[] | null> = new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        time: '2016-01-26T14:00:00+02:00',
                        value: 0.1,
                        unit: 'm',
                        siteId: 3401,
                        siteName: 'Espoonlahti 118',
                        parameterNameEng: 'Ice thickness',
                        site: {
                            latitude: 60.16363,
                            longitude: 24.58969,
                            depth: 16,
                        },
                        dataSource: 'SYKE',
                    },
                    {
                        time: '2016-02-22T00:00:00+02:00',
                        value: 0.36,
                        unit: 'm',
                        siteId: 5663,
                        siteName: 'Klobbfjärden',
                        parameterNameEng: 'Ice thickness',
                        site: {
                            latitude: 63.28862,
                            longitude: 21.1285,
                            depth: 4.4,
                        },
                        dataSource: 'SYKE',
                    },
                ]);
            }, 0);
        });
        const veslaApiStub = sinon.stub(sykeApi, 'default').returns(stubResponse);

        const startDate = new Date(Date.UTC(2016, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(2017, 0, 1, 0, 0, 0));
        const periodStart = new Date(Date.UTC(2000, 9, 1, 0, 0, 0));
        const periodEnd = new Date(Date.UTC(2000, 3, 1, 0, 0, 0));
        const sites = [new Site(3401, 'Espoonlahti 118', 60.16363, 24.58969, 16, SiteTypes.Vesla),
        new Site(5663, 'Klobbfjärden', 63.28862, 21.12850, 4.4, SiteTypes.Vesla)];
        const params = new CommonParameters(startDate, endDate, periodStart, periodEnd, sites);

        await module.getData(params);
        const actualResults = module.data!;

        const expectedResults: IResponseFormat[] = [{
            time: '2016-01-26T14:00:00+02:00',
            analyteName: 'Ice thickness',
            value: '0.1',
            unit: 'm',
            siteId: 3401,
            site: 'Espoonlahti 118',
            siteLatitudeWGS84: '60.16363',
            siteLongitudeWGS84: '24.58969',
            siteDepthM: '16',
            dataSource: 'SYKE',
        },
        {
            time: '2016-02-22T00:00:00+02:00',
            analyteName: 'Ice thickness',
            value: '0.36',
            unit: 'm',
            siteId: 5663,
            site: 'Klobbfjärden',
            siteLatitudeWGS84: '63.28862',
            siteLongitudeWGS84: '21.12850',
            siteDepthM: '4.4',
            dataSource: 'SYKE',
        }];

        compareArrays(actualResults, expectedResults);

        veslaApiStub.restore();
    });
});
