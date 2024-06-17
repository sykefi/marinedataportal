import { CommonParameters } from '../commonParameters'
import {getVeslaData, getSinglePageVeslaData, getODataNextPage} from '@/apis/sykeApi'
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

/** Yield through each page of the API response to populate the actual results */
export async function* getObservations(
  params: CommonParameters,
  obsCode: string
) {
    if (params.veslaSites.length === 0) {
      return []
    }
    const filter = getFilter(params, obsCode)
  
    let firstResults = await getSinglePageVeslaData(resource, query + '&' + filter)
    if (!firstResults?.value){
      return []
    }
    let nextLink = firstResults?.nextLink
    if (!nextLink){
      firstResults.value.map((r) => fromObservationToSykeFormat(r))
      if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
        return cleanupTimePeriod(firstResults.value, params) //TODO: optimize the API calls so that we're not requesting data outside of the selected periods
      }
      yield firstResults.value
      return
    }
    
    yield firstResults!.value
    while(nextLink){
      let results = await getODataNextPage(resource,nextLink)
      if (!results?.value){
        return
      }
      nextLink = results?.nextLink
      results.value.map((r) => fromObservationToSykeFormat(r))
      if (params.datePeriodMonths?.start !== params.datePeriodMonths?.end) {
        return cleanupTimePeriod(results.value, params)
      }
      yield results.value
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
