import { GetSimpleFmiResponse } from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

const query =
  '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=WATLEV'

export async function getWaterLevels(params: CommonParameters) {
  return await GetSimpleFmiResponse(query, params, params.mareographSites)
}
