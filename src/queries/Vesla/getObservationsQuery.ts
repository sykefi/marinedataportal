import { CommonParameters } from '../commonParameters'
import getVeslaData from '@/apis/sykeApi'
import {
  buildODataInFilterFromArray,
  cleanupTimePeriod,
  getTimeParametersForVeslaFilter,
  fromObservationToSykeFormat,
} from '@/helpers'

const select = [
  'Time',
  'Value',
  'Unit',
  'SiteId',
  'SiteName',
  'ParameterNameEng',
]

const query =
  'Observations?api-version=1.0&\
$orderby=SiteId,Time&\
$select=' + select.join(',')

async function getFilter(params: CommonParameters, obsCode: string) {
  let filter =
    '&$expand=Site($select=Latitude,Longitude,Depth)' +
    '&$filter=Site/EnvironmentTypeId in (31,32,33)' +
    ` and ParameterCode eq '${obsCode}'`

  filter += getTimeParametersForVeslaFilter(params)

  filter += buildODataInFilterFromArray(
    params.veslaSites.map((s) => s.id),
    'Site/SiteId',
    true
  )

  return filter
}

export async function getObservations(
  params: CommonParameters,
  obsCode: string
) {
  if (params.veslaSites.length === 0) {
    return []
  }
  const filter = await getFilter(params, obsCode)
  let results = await getVeslaData(query + filter)
  if (!results) {
    return []
  }
  results = results.map((r) => fromObservationToSykeFormat(r))
  if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
    return cleanupTimePeriod(results, params)
  }
  return results
}

export async function getObservationSiteIds(
  params: CommonParameters,
  obsCode: string
) {
  const filter = await getFilter(params, obsCode)
  const q = 'Observations?api-version=1.0&$select=siteId' + filter
  let data = await getVeslaData(q)
  if (data) {
    data = data.map((d) => d.siteId)
  }
  return data as number[]
}
