import { CommonParameters } from '../commonParameters'
import getVeslaData from '@/apis/sykeApi'
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

const query =
  'results?api-version=1.0&\
$orderby=DeterminationId,SiteId,Time&\
$select=' + select.join(',')

async function getFilter(
  params: CommonParameters,
  determinationIds: number[],
  depth: IDepthSettings
) {
  let filter =
    '&$filter= EnvironmentTypeId in (31,32,33)' +
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

export async function getWaterQuality(
  par: CommonParameters,
  combinationIds: number[],
  depth: IDepthSettings
) {
  if (par.veslaSites.length === 0) {
    return []
  }
  const filter = await getFilter(par, combinationIds, depth)
  let results = await getVeslaData(query + filter)
  if (!results) {
    return []
  }
  results = results.map((r) => fromWaterQualityResultToSykeFormat(r))
  if (par.datePeriodMonths?.start !== par.datePeriodMonths?.end) {
    return cleanupTimePeriod(results, par)
  }
  return results
}

export async function getWaterQualitySiteIds(
  par: CommonParameters,
  combinationIds: number[],
  depth: IDepthSettings
) {
  const filter = await getFilter(par, combinationIds, depth)
  const q = 'results/siteids?api-version=1.0&' + filter
  return (await getVeslaData(q)) as number[]
}
