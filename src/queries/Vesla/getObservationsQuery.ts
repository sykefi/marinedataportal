import { CommonParameters } from '../commonParameters'
import { getVeslaData, getPagedODataResponse } from '@/apis/sykeApi'
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

export async function* getObservations(
  params: CommonParameters,
  obsCode: string
) {
  if (params.veslaSites.length === 0) {
    return []
  }
  const filter = getFilter(params, obsCode)
  const resultGenerator = getPagedODataResponse(resource, query + '&' + filter)
  for await (const batch of resultGenerator) {
    batch.value.map((r) => fromObservationToSykeFormat(r))
    if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
      yield cleanupTimePeriod(batch.value, params)
    }
    yield batch.value
  }
}

export async function getObservationSiteIds(
  params: CommonParameters,
  obsCode: string
) {
  const filter = await getFilter(params, obsCode)
  let data = await getVeslaData(resource, '$select=siteId' + filter)
  if (data) {
    data = data.map((d) => d.siteId)
  }
  return data as number[]
}
