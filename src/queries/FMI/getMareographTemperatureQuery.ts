import { GetSimpleFmiResponse } from '@/apis/fmiApi'
import { CommonParameters } from '@/queries/commonParameters'

const query =
  '&request=getFeature&storedquery_id=fmi::observations::mareograph::simple&parameters=TW_PT1H_AVG'

export async function getMareographTemperatures(params: CommonParameters) {
  return await GetSimpleFmiResponse(query, params, params.mareographSites)
}
