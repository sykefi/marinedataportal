import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';
import { DepthOptions } from '@/store/searchParameterModule';
import { buildODataInFilterFromArray, cleanupTimePeriod } from '@/helpers';

const select = [
  'Time',
  'AnalyteName',
  'Value',
  'Unit',
  'SiteId',
  'Site',
  'siteLatitudeWGS84',
  'siteLongitudeWGS84',
  'samplingLatitudeWGS84',
  'samplingLongitudeWGS84',
  'SampleDepthM',
  'SampleDepthUpperM',
  'SampleDepthLowerM',
  'SiteDepthM',
  'TotalDepthM',
];

const query = 'results?api-version=1.0&\
$orderby=DeterminationId,SiteId,Time&\
$select=' + select.join(',');

async function getFilter(params: CommonParameters, determinationIds: number[]) {
  let filter = '&$filter= EnvironmentTypeId in (31,32,33)' +
    ` and Time ge ${params.formattedDateStart}` +
    ` and Time le ${params.formattedDateEnd}`;

  switch (params.depthSelection) {
    case DepthOptions.DepthInterval:
      if (params.depthStart !== null && params.depthEnd !== null) {
        // the lower depth is always null, unless the result is of a combination sample
        filter += ` and (SampleDepthLowerM eq null or` +
          `(SampleDepthLowerM ge ${params.depthStart} and SampleDepthLowerM le ${params.depthEnd}))` +
          ` and SampleDepthUpperM ge ${params.depthStart} and SampleDepthUpperM le ${params.depthEnd}`;
      }
      break;
    case DepthOptions.SeaFloorLayer:
      filter += ' and IsSeaOrLakeBedLevel eq 1';
      break;
    case DepthOptions.SurfaceLayer:
      filter += ' and IsSeaOrLakeSurfaceLevel eq 1';
      break;
  }
  if (params.datePeriodMonths) {
    if (params.datePeriodMonths.start > params.datePeriodMonths.end) {
      filter += ` and (month(Time) ge ${params.datePeriodMonths.start} or month(Time) le ${params.datePeriodMonths.end})`;
    } else {
      filter += ` and (month(Time) ge ${params.datePeriodMonths.start} and month(Time) le ${params.datePeriodMonths.end})`;
    }
  }
  if (params.datePeriodDays) {
    filter += buildODataInFilterFromArray(params.datePeriodDays, 'day(Time)', true);
  }

  filter += buildODataInFilterFromArray(determinationIds, 'DeterminationCombinationId', true);
  filter += buildODataInFilterFromArray(params.veslaSites.map((s) => s.id), 'SiteId', true);

  return filter;
}

export async function getWaterQuality(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  const results = await getVeslaData(query + filter);
  if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
    return cleanupTimePeriod(results, params);
  }
  return results;
}

export async function getWaterQualitySiteIds(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  const q = 'results/siteids?api-version=1.0&' + filter;
  return await getVeslaData(q) as number[];
}
