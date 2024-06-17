import { CommonParameters } from '../commonParameters'
import {getSinglePageVeslaData, getVeslaData, getODataNextPage} from '@/apis/sykeApi'
import {
  buildODataInFilterFromArray,
  cleanupTimePeriod,
  getTimeParametersForVeslaFilter,
  fromWaterQualityResultToSykeFormat,
} from '@/helpers'
import { DepthOptions, IDepthSettings } from '@/stores/waterQualityStore'

const select = [
  'time',
  'analyteName',
  'value',
  'unit',
  'siteId',
  'site',
  'siteLatitudeWGS84',
  'siteLongitudeWGS84',
  'samplingLatitudeWGS84',
  'samplingLongitudeWGS84',
  'sampleDepthM',
  'sampleDepthUpperM',
  'sampleDepthLowerM',
  'siteDepthM',
  'totalDepthM',
  'laboratory',
  'flag',
]

const resource = 'Results'

const query = '$orderby=DeterminationId,SiteId,Time&$select=' + select.join(',')

function getFilter(
  params: CommonParameters,
  determinationIds: number[],
  depth: IDepthSettings
) {
  let filter =
    '$filter= EnvironmentTypeId in (31,32,33)' +
    // results with W flag (W, WL, WG) are uncertain and not shown in the portal
    ` and (Flag eq null or not contains(Flag, 'W'))`

  switch (depth.option) {
    case DepthOptions.DepthInterval:
      // the lower depth is always null, unless the result is of a combination sample
      filter +=
        ` and (SampleDepthLowerM eq null or` +
        `(SampleDepthLowerM ge ${depth.start} and SampleDepthLowerM le ${depth.end}))` +
        ` and SampleDepthUpperM ge ${depth.start} and SampleDepthUpperM le ${depth.end}`
      break
    case DepthOptions.SeaFloorLayer:
      filter += ' and IsSeaOrLakeBedLevel eq 1'
      break
    case DepthOptions.SurfaceLayer:
      filter += ' and IsSeaOrLakeSurfaceLevel eq 1'
      break
    case DepthOptions.AllLayers:
      // no filter for depth
      break
  }

  filter += getTimeParametersForVeslaFilter(params)

  filter += buildODataInFilterFromArray(
    determinationIds,
    'DeterminationCombinationId',
    true
  )
  filter += buildODataInFilterFromArray(
    params.veslaSites.map((s) => s.id),
    'SiteId',
    true
  )

  return filter
}

/** Yield through each page of the API response to populate the actual results */
export async function* getWaterQuality(
  par: CommonParameters,
  combinationIds: number[],
  depth: IDepthSettings
) {
  if (par.veslaSites.length === 0) {
    return []
  }
  const filter = getFilter(par, combinationIds, depth)

  let firstResults = await getSinglePageVeslaData(resource, query + '&' + filter)
  if (!firstResults?.value){
    return []
  }
  let nextLink = firstResults?.nextLink
  if (!nextLink){
    firstResults.value.map((r) => fromWaterQualityResultToSykeFormat(r))
    if (par.datePeriodMonths?.start !== par.datePeriodMonths?.end) {
      return cleanupTimePeriod(firstResults.value, par) //TODO: optimize the API calls so that we're not requesting data outside of the selected periods
    }
    return firstResults.value
  }
  
  yield firstResults!.value
  while(nextLink){
    let results = await getODataNextPage(resource,nextLink)
    if (!results?.value){
      return
    }
    nextLink = results?.nextLink
    results.value.map((r) => fromWaterQualityResultToSykeFormat(r))
    if (par.datePeriodMonths?.start !== par.datePeriodMonths?.end) {
      return cleanupTimePeriod(results.value, par)
    }
    yield results.value
  }
}

export async function getWaterQualitySiteIds(
  par: CommonParameters,
  combinationIds: number[],
  depth: IDepthSettings
) {
  const filter = getFilter(par, combinationIds, depth)
  return (await getVeslaData(resource, filter)) as number[]
}
