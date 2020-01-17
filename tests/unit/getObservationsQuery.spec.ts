import { CommonParameters } from '@/queries/commonParameters';
import { Site, SiteTypes } from '@/queries/site';
import { IResponseFormat } from '@/queries/IResponseFormat';
import { compareArrays } from '@/../tests/unit/fmiApi.spec';
import { IceThicknessModule } from '@/store/attributeModules/iceThicknessModule';
import Vuex from 'vuex';

describe('Integration tests for Vesla api', () => {
    const store = new Vuex.Store({ strict: true });
    const module = new IceThicknessModule({ store, name: 'testIceThickness' });

    it('returns correct results when ice thickness is queried', async () => {
        const startDate = new Date(Date.UTC(2016, 0, 1, 0, 0, 0));
        const endDate = new Date(Date.UTC(2017, 0, 1, 0, 0, 0));
        const periodStart = new Date(Date.UTC(2000, 9, 1, 0, 0, 0));
        const periodEnd = new Date(Date.UTC(2000, 3, 1, 0, 0, 0));
        const sites = [new Site(3401, 'Espoonlahti 118', 60.16363, 24.58969, 16, SiteTypes.Vesla),
        new Site(5663, 'Klobbfjärden', 63.28862, 21.12850, 4.4, SiteTypes.Vesla)];
        const params = new CommonParameters(startDate, endDate, periodStart, periodEnd, sites);

        module.getData(params);

        const expectedResults: IResponseFormat[] = [{
            time: '2016-01-26T14:00:00+02:00',
            analyteName: 'Ice thickness',
            value: '0.1',
            unit: 'm',
            siteId: 3401,
            site: 'Espoonlahti 118',
            siteLatitudeWGS84: 60.16363,
            siteLongitudeWGS84: 24.58969,
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
            siteLatitudeWGS84: 63.28862,
            siteLongitudeWGS84: 21.12850,
            siteDepthM: '4.4',
            dataSource: 'SYKE',
        }];

        compareArrays(module.data!, expectedResults);
    });
})