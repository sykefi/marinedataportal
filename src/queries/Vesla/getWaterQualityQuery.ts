import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';
import { buildODataEqualFilterFromArray } from '@/helpers';

const query = 'results?api-version=1.0&\
$select=Time,AnalyteName,SiteId,Site,SampleDepthM,SampleDepthUpperM,SampleDepthLowerM,Value&\
$orderby=DeterminationId,SiteId,Time&';

async function getFilter(params: CommonParameters, determinationIds: number[]) {
  let filter = '$filter= EnvironmentTypeId in (31,32,33)' +
    ` and Time ge ${params.formattedDateStart}` +
    ` and Time le ${params.formattedDateEnd}`;

  filter += buildODataEqualFilterFromArray(determinationIds, 'DeterminationCombinationId', true);
  filter += buildODataEqualFilterFromArray(params.sites.map((s) => s.id), 'SiteId', true);

  return filter;
}

export async function getWaterQuality(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  return await getVeslaData(query + filter);
}

export async function getWaterQualitySiteIds(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  const q = 'results/siteids?api-version=1.0&' + filter;
  return await getVeslaData(q) as number[];
}
