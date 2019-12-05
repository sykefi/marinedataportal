import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';
import { buildODataInFilterFromArray, cleanupTimePeriod } from '@/helpers';

const select = [
  'Time',
  'Value',
  'Unit',
  'SiteId',
  'SiteName',
  'ParameterNameEng',
];

const query = 'Observations?api-version=1.0&\
$orderby=SiteId,Time&\
$select=' + select.join(',');

async function getFilter(params: CommonParameters) {
  let filter = '&$expand=Site($select=Latitude,Longitude,Depth)' +
    '&$filter=Site/EnvironmentTypeId in (31,32,33)' +
    ` and Time ge ${params.formattedDateStart}` +
    ` and Time le ${params.formattedDateEnd}` +
    ` and ParameterCode eq 'SDT'`;

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

  filter += buildODataInFilterFromArray(params.veslaSites.map((s) => s.id), 'Site/SiteId', true);

  return filter;
}

export async function getSecchiDepth(params: CommonParameters) {
  const filter = await getFilter(params);
  let results = await getVeslaData(query + filter);
  results = results.map((r) => {
    const flat = { ...r };
    flat.siteLatitudeWGS84 = r.site.latitude;
    flat.siteLongitudeWGS84 = r.site.longitude;
    flat.siteDepth = r.site.depth;
    delete flat.site;
    return flat;
  });
  if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
    return cleanupTimePeriod(results, params);
  }
  return results;
}

export async function getSecchiDepthSiteIds(params: CommonParameters) {
  const filter = await getFilter(params);
  const q = 'Observations?api-version=1.0&$select=siteId' + filter;
  let data = await getVeslaData(q);
  data = data.map((d) => d.siteId);
  return data as number[];
}
