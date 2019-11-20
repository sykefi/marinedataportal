import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';
import { buildODataInFilterFromArray } from '@/helpers';

const query = 'results?api-version=1.0&\
$select=Time,AnalyteName,SiteId,Site,SampleDepthM,SampleDepthUpperM,SampleDepthLowerM,Value&\
$orderby=DeterminationId,SiteId,Time&';

async function getFilter(params: CommonParameters, determinationIds: number[]) {
  let filter = '$filter= EnvironmentTypeId in (31,32,33)' +
    ` and Time ge ${params.formattedDateStart}` +
    ` and Time le ${params.formattedDateEnd}`;

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
  filter += buildODataInFilterFromArray(params.sites.map((s) => s.id), 'SiteId', true);

  return filter;
}

export async function getWaterQuality(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  const results = await getVeslaData(query + filter);
  if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
    return results.filter((r) => {
      // remove results that go over the specified time period
      // example: time period 3/21 - 6/19:
      // first allow all results from months 4 - 5
      // check the results days from months 3 and 6, discard those that cross the limits
      const month = parseInt(r.time.substring(5, 7), 10);
      if (month > params.datePeriodMonths!.start && month < params.datePeriodMonths!.end) {
        return true;
      }
      const day = parseInt(r.time.substring(8, 10), 10);
      if (month === params.datePeriodMonths!.start) {
        return day >= params.datePeriodStartDay!;
      }
      if (month === params.datePeriodMonths!.end) {
        return day <= params.datePeriodEndDay!;
      }
    });
  }
  return results;
}

export async function getWaterQualitySiteIds(params: CommonParameters, determCombinationIds: number[]) {
  const filter = await getFilter(params, determCombinationIds);
  const q = 'results/siteids?api-version=1.0&' + filter;
  return await getVeslaData(q) as number[];
}
