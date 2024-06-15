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

const resource = 'Observations'

const query = '$orderby=SiteId,Time&$select=' + select.join(',')

function getFilter(params: CommonParameters, obsCode: string) {
  let filter =
    'Site/EnvironmentTypeId in (31,32,33)' +
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
  let filter = getFilter(params, obsCode)
  filter += '&$expand=Site($select=Latitude,Longitude,Depth)'
  let results = await getVeslaData(resource, query + '&$filter=' + filter)
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
  const filter = getFilter(params, obsCode)
  let data = await getVeslaData(
    resource,
    '$apply=filter(' + filter + ')/groupby((siteId))&$orderby=siteId'
  )
  if (data) {
    data = data.map((d) => d.siteId)
  }
  return data as number[]
}
