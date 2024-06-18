import { CommonParameters } from '../commonParameters'
import getPagedODataResponse from '@/apis/sykeApi'
import {
  buildODataInFilterFromArray,
  cleanupTimePeriod,
  getTimeParametersForVeslaFilter,
  fromObservationToSykeFormat,
} from '@/helpers'
import { IResponseFormat } from '../IResponseFormat'

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
): AsyncGenerator<IResponseFormat[]> {
  if (params.veslaSites.length === 0) {
    return []
  }
  const filter = getFilter(params, obsCode)
  const resultGenerator = getPagedODataResponse(resource, query + '&' + filter)
  for await (const batch of resultGenerator) {
    const res = batch.value.map((r) => fromObservationToSykeFormat(r))
    if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
      yield cleanupTimePeriod(res, params)
    } else {
      yield res
    }
  }
}

export async function getObservationSiteIds(
  params: CommonParameters,
  obsCode: string
) {
  const filter = getFilter(params, obsCode)
  const generator = getPagedODataResponse(resource, '$select=siteId' + filter)
  const data: number[] = []
  for await (const batch of generator) {
    data.push(...batch.value.map((d: any) => d.siteId))
  }
  return data
}
