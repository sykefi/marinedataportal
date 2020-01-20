import { CommonParameters } from '@/queries/commonParameters';
import { Site, SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { compareArrays } from '@/../tests/unit/fmiApi.spec';
import { SurfaceTemperatureModule } from '@/store/attributeModules/surfaceTemperatureModule';
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
